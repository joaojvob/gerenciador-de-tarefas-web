export const landingContent = {
    badge: "SaaS Multi-tenant com Laravel + React",
    heroTitle: "Gerencie tarefas por workspace com segurança e escala",
    heroDescription:
        "Uma plataforma para equipes organizarem tarefas com autenticação, isolamento por tenant e regras de permissão por papel.",
    navItems: [
        {
            label: "Produto",
            bgColor: "#0D0716",
            textColor: "#fff",
            links: [
                {
                    label: "Recursos",
                    ariaLabel: "Recursos do Produto",
                    href: "#produto",
                },
                {
                    label: "Preços",
                    ariaLabel: "Tabela de Preços",
                    href: "#precos",
                },
            ],
        },
        {
            label: "Empresa",
            bgColor: "#170D27",
            textColor: "#fff",
            links: [
                {
                    label: "Sobre nós",
                    ariaLabel: "Sobre a empresa",
                    href: "#empresa",
                },
                {
                    label: "Carreiras",
                    ariaLabel: "Vagas abertas",
                    href: "#carreiras",
                },
            ],
        },
        {
            label: "Suporte",
            bgColor: "#271E37",
            textColor: "#fff",
            links: [
                {
                    label: "Documentação",
                    ariaLabel: "Docs",
                    href: "#suporte",
                },
                {
                    label: "Contato",
                    ariaLabel: "Fale conosco",
                    href: "#contato",
                },
            ],
        },
    ],
    sections: [
        {
            id: "produto",
            title: "Produto",
            subtitle:
                "Plataforma desenhada para times que precisam de clareza e velocidade.",
            spotlightColor: "rgba(79, 70, 229, 0.22)",
            cards: [
                {
                    title: "Multi-workspace",
                    description:
                        "Separe clientes, times e projetos com isolamento por contexto.",
                },
                {
                    title: "Permissões por papel",
                    description:
                        "Controle acesso por owner, admin e membro com segurança.",
                },
                {
                    title: "Produtividade do time",
                    description:
                        "Organize status, prazos e prioridades em um fluxo claro.",
                },
            ],
        },
        {
            id: "empresa",
            title: "Empresa",
            subtitle:
                "Crescimento sustentável com foco em impacto real para o cliente.",
            spotlightColor: "rgba(99, 102, 241, 0.20)",
            cards: [
                {
                    title: "Nossa missão",
                    description:
                        "Ajudar equipes a entregarem com clareza, contexto e colaboração contínua.",
                },
                {
                    title: "Como trabalhamos",
                    description:
                        "Produto orientado a feedback real de usuários e evolução incremental.",
                },
                {
                    title: "Cultura",
                    description:
                        "Autonomia com responsabilidade, foco no cliente e comunicação transparente.",
                },
            ],
        },
        {
            id: "suporte",
            title: "Suporte",
            subtitle:
                "Acompanhamento contínuo para operação estável e evolução do seu time.",
            spotlightColor: "rgba(56, 189, 248, 0.22)",
            cards: [
                {
                    title: "Documentação",
                    description:
                        "Guias rápidos para setup, autenticação, workspaces e gestão de tarefas.",
                },
                {
                    title: "Base de conhecimento",
                    description:
                        "Respostas para dúvidas frequentes sobre permissões, convites e fluxo diário.",
                },
                {
                    title: "Contato",
                    description:
                        "Fale com nosso time para suporte técnico e acompanhamento de implantação.",
                },
            ],
        },
    ],
    cta: {
        overline: "pronto para começar?",
        title: "Crie seu workspace em minutos",
    },
    footer: {
        copyright: "© 2026 TaskFlow. Todos os direitos reservados.",
        links: [
            { label: "Termos", href: "#" },
            { label: "Privacidade", href: "#" },
            { label: "Status", href: "#" },
        ],
    },
};
