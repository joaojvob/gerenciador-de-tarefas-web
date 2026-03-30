# Gerenciador de Tarefas — API SaaS

[![PHP](https://img.shields.io/badge/PHP-8.2+-blue.svg)](https://php.net)
[![Laravel](https://img.shields.io/badge/Laravel-11-red.svg)](https://laravel.com)
[![Sanctum](https://img.shields.io/badge/Auth-Sanctum-orange.svg)](https://laravel.com/docs/sanctum)
[![License](https://img.shields.io/badge/licença-MIT-green.svg)](LICENSE)

API RESTful construída com Laravel 11 para um sistema de gerenciamento de tarefas com arquitetura SaaS multi-tenant. Desenvolvida como projeto de portfólio com foco em boas práticas de engenharia de software.

---

## Sobre o Projeto

Refatoração completa de um gerenciador de tarefas monolítico para uma API enterprise-level. O projeto demonstra domínio de padrões arquiteturais modernos do ecossistema Laravel:

- **Actions** para encapsulamento da lógica de negócio (Skinny Controllers)
- **Form Requests** para validação desacoplada
- **API Resources** para contratos JSON padronizados
- **Policies** para autorização granular por recurso
- **Multi-tenancy** via Workspaces com sistema de roles por membro
- **Backed Enums** (PHP 8.1+) para tipagem segura de estados e prioridades
- **Jobs & Queues** para processamentos assíncronos
- **Feature Tests** com Pest

---

## Arquitetura

```
app/
├── Actions/          # Lógica de negócio (1 classe = 1 operação)
│   ├── Auth/
│   ├── Task/
│   └── Workspace/
├── Enums/            # PHP Backed Enums (TaskStatus, TaskPriority, Role)
├── Http/
│   ├── Controllers/Api/   # Skinny Controllers
│   ├── Requests/          # Validação via Form Requests
│   └── Resources/         # Contratos de resposta JSON
├── Models/           # Eloquent Models com Relationships
├── Policies/         # Autorização por recurso
├── Jobs/             # Background jobs para filas
└── Notifications/    # Notificações (email, broadcast)
```

---

## Banco de Dados

O schema é construído para suportar multi-tenancy real:

| Tabela | Descrição |
|---|---|
| `users` | Usuários da plataforma |
| `workspaces` | Espaços de trabalho (tenant) |
| `workspace_members` | Membros por workspace com `role` (owner/admin/member) |
| `tasks` | Tarefas vinculadas ao workspace, com atribuição, prioridade e status |

---

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Backend | Laravel 11 (PHP 8.2+) |
| Autenticação | Laravel Sanctum |
| Banco de dados | MySQL 8+ |
| Testes | Pest |
| Filas | Laravel Queues (Redis recomendado) |
| Frontend (em breve) | React SPA |

---

## Instalação

### Pré-requisitos

- PHP 8.2+
- Composer
- MySQL 8+
- Git

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/joaojvob/gerenciador-de-tarefas-web.git
cd gerenciador-de-tarefas-web

# 2. Instale as dependências PHP
composer install

# 3. Configure o ambiente
cp .env.example .env
php artisan key:generate

# 4. Configure o banco de dados no .env e rode as migrations
php artisan migrate

# 5. (Opcional) Popule com dados de desenvolvimento
php artisan db:seed

# 6. Inicie o servidor
php artisan serve
```

---

## Endpoints da API

> Todos os endpoints protegidos requerem o header `Authorization: Bearer {token}`.

### Autenticação

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/register` | Cadastro de novo usuário |
| `POST` | `/api/login` | Login e geração de token |
| `POST` | `/api/logout` | Revogação do token |

### Workspaces

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/workspaces` | Lista workspaces do usuário |
| `POST` | `/api/workspaces` | Cria novo workspace |
| `GET` | `/api/workspaces/{slug}` | Detalhes do workspace |
| `PUT` | `/api/workspaces/{slug}` | Atualiza workspace |
| `DELETE` | `/api/workspaces/{slug}` | Arquiva workspace |

### Membros

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/workspaces/{slug}/members` | Lista membros |
| `POST` | `/api/workspaces/{slug}/members` | Convida membro |
| `PATCH` | `/api/workspaces/{slug}/members/{id}` | Altera role do membro |
| `DELETE` | `/api/workspaces/{slug}/members/{id}` | Remove membro |

### Tarefas

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/workspaces/{slug}/tasks` | Lista tarefas do workspace |
| `POST` | `/api/workspaces/{slug}/tasks` | Cria tarefa |
| `GET` | `/api/workspaces/{slug}/tasks/{id}` | Detalhes da tarefa |
| `PUT` | `/api/workspaces/{slug}/tasks/{id}` | Atualiza tarefa |
| `DELETE` | `/api/workspaces/{slug}/tasks/{id}` | Remove tarefa |

---

## Roadmap

- [x] Etapa 1 — Estrutura de diretórios + Migrations multi-tenant + Enums
- [x] Etapa 2 — Models, Relationships e Policies
- [x] Etapa 3 — Form Requests e Actions
- [x] Etapa 4 — Controllers, API Resources e Rotas
- [x] Etapa 5 — Feature Tests com Pest
- [x] Etapa 6 — Jobs, Filas e Notificações
- [x] Etapa 7 — Frontend SPA em React

---

## Licença

Distribuído sob a licença MIT. Veja [`LICENSE`](LICENSE) para mais informações.
