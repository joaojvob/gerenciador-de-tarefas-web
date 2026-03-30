# Arquitetura do SaaS: Gerenciador de Tarefas Enterprise

## 📌 Visão Geral
Este documento sintetiza a refatoração do projeto "Agendador de Tarefas" (um monolito simples em Laravel) em um **produto SaaS B2B moderno e escalável**. O objetivo foi construir um back-end sólido, focado na separação de responsabilidades (SOLID), preparado para lidar com múltiplos *tenants* (Workspaces) e preparado para ser consumido por uma SPA em React.

Stack utilizada: **Laravel 11, PHP 8.2, MySQL 8, Redis, Pest (Testes).**

---

## 🏗️ 1. Padrões de Arquitetura e Clean Code

A arquitetura foi desenhada para manter os controllers limpos e a lógica de negócio encapsulada, falhando rápido em validações antes de chegar ao domínio da aplicação.

### 1.1 "Skinny Controllers, Fat Actions"
Ao invés de adotar o padrão tradicional `Service/Repository`, adotamos o padrão **Action-based**.
* **O Problema:** Services tendem a crescer infinitamente com dezenas de métodos interligados (Fat Services).
* **A Solução:** Classes Action de Responsabilidade Única (SRP). Uma action faz exatamente uma coisa, isolando a regra de negócio.
  * Exemplo: `RegisterAction`, `InviteMemberAction`, `ProcessTaskDueSoonJob`.
* Controllers atuam estritamente como orquestradores: recebem o Request validado, invocam um (ou mais) Actions, e respondem via um API Resource.

### 1.2 Form Requests (Validação Desacoplada)
Toda entrada de dados da API é previamente limpa e validada via **Form Requests**.
* Garante que o Controller (ou Action) nunca tenha que lidar com dados mal formatados ou perigosos.
* Validações complexas (como `Rule::unique` e restrições semânticas) residem no Request, gerando erros HTTP 422 automaticamente sem poluir a lógica do negócio.

### 1.3 API Resources (Contratos JSON)
O framework expõe os dados estritamente via **API Resources**.
* **Segurança:** Oculta campos internos (ex: `password`, `remember_token`, timestamps irrelevantes).
* **Prevenção de N+1:** O uso do wrapper `whenLoaded()` nas Resources permite expor relações apenas quando intencionalmente carregadas pelos Controllers.
* **Padronização:** Enums como `TaskStatus` são transformados, expondo o valor (`pending`), o label legível (`Pendente`) e a cor visual (`#F59E0B`).

---

## 🏢 2. Multi-tenancy (Workspaces) e Autorização

O software mudou da visão focada em Usuário -> Tarefa para **Workspace -> Tarefa**.

* **Workspaces:** Tabela principal contendo o escopo. Foi implementado um gerador algorítmico de **Slugs** (via model hook) para fornecer URLs amigáveis. Cada workspace tem rotas *scoped*, ex: `/api/workspaces/minha-empresa-123/tasks`.
* **Membros e Papéis (Roles):** Foi adicionada a pivot table `workspace_members` para representar a posse (n:m).
  * Criado o enum nativo do PHP 8.1+ `WorkspaceMemberRole` (`Owner`, `Admin`, `Member`).
  * A role define o que a pessoa pode fazer. Administradores podem convidar outras pessoas; apenas o `Owner` pode encerrar o workspace.

### 2.1 Políticas Cíclicas (Policies)
A lógica não está em condicionais manuais (`if ($user->admin)`). Utilizamos **Laravel Policies** (`WorkspacePolicy`, `TaskPolicy`).
* Nossas Controllers usam o helper nativo `$this->authorize()`, injetando a Policy automaticamente e bloqueando requisições ilegais (retornando 403).

---

## 🚀 3. Governança B2B (Super Admin, ABAC e Kanban)

Na evolução para o "SaaS Nível 2", foram injetados controles granulares para atender a organizações complexas:

### 3.1 Super Admin (Plataforma)
* **Bypass Global:** Introduzida a flag `is_super_admin` (`users`). As Policies utilizam o método mágico `before()` para interceptar validações. Se for Super Admin, o Laravel concede autoridade root, ignorando as blindagens dos Tenants permitindo auditoria no Hub Global (Dashboard BI).

### 3.2 ABAC (Attribute-Based Access Control) e Billing Roles
* **Planos de Assinatura:** A tabela `workspaces` passou a controlar níveis de assinatura (ex: `free` ou `premium`).
* A `WorkspacePolicy` cruza o Papel do usuário (RBAC) com o Plano da Empresa (ABAC). Exemplo: O método `inviteMember` bloqueia convites adicionais se a contagem atingir 5 membros em planos `free`, forçando Upgrade (Upselling).

### 3.3 A Máquina de Estados (State Machine) e Kanban
* O fluxo de tarefas foi reescrito em forma de funil rígido mapeado no **Enum `TaskStatus`**: `Backlog -> Assigned -> InProgress -> Paused -> Completed / Incomplete`.
* **Segurança Granular:** O método `index` do TaskController impõe *Scopes* rígidos: `Members` (Trabalhadores) recebem apenas as tarefas onde `assigned_to` é igual ao seu ID. 
* O `UpdateTaskRequest` foi endurecido: Trabalhadores não podem interceptar a API via cliente externo para alterar Títulos, Descrições ou Prazos — a request aceita exclusivamente o envio de novos Status (Kanban flow).

---

## ⚡ 4. Notificações e Jobs em Background (Filas)

Como um produto de nível Enterprise, lentidão por bloqueio I/O não é admissível em endpoints transacionais.

* Todas as operações de notificação (como `WorkspaceInvitationNotification`) usam a trait `ShouldQueue`, indo parar em um provedor de fila (neste caso, container **Redis**).
* Implementamos Jobs proativos como o `ProcessTaskDueSoonJob`, disparado assincronamente a cada hora via Task Scheduler do console (`php artisan schedule:run`). O Job audita as tarefas que estão próximas do vencimento e alerta os encarregados.

---

## 🐳 5. Infraestrutura como Código (Docker)

O ambiente foi Dockerizado sem o uso de abstracts simplificadores (como o Sail), mostrando controle real da infraestrutura:

1. **`app`**: Recipiente de build PHP 8.2-FPM compilado nativamente com extensões precisas (pdo_mysql, gd, intl, bcmath, redis, zip).
2. **`web`**: Servidor Nginx (`nginx:alpine`) configurado via block limpo que roteia requests HTTP pela porta 8000 para a FPM no diretório `/public`.
3. **`db` (MySQL) e `redis` (Cache/Queues)** com persistência limpa via Docker Volumes, garantindo agilidade no dev local com performance superior a drivers genéricos.
4. **`worker`**: Replica passiva do container FPM que consome as filas agendadas constantemente (`php artisan queue:work`).

---

## 🧪 6. Garantia de Qualidade (Testes)

Todo o core de backend foi garantido através do **Pest PHP**. A suíte cobre inteiramente a camada Feature:
* Autenticação e Rotulagem de Sessão (Sanctum).
* Endpoints expostos das CRUDs validando estrutura do payload e *Soft Delete*.
* Checagem das barreiras de Autorização (403) para atores não permitidos.
* Prevenção contra N+1 em listagens.

---
*Este documento reflete a arquitetura implementada nas etapas backend, validando domínio estrito do PHP/Laravel moderno.*
