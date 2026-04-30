# 🐾 VetSite - E-commerce & Gestão Veterinária

O **VetSite** é um projeto Full Stack desenvolvido para modernizar o fluxo de vendas e gestão de clínicas veterinárias. O sistema separa de forma clara as responsabilidades entre um Backend robusto em Django e um Frontend dinâmico em React.

---

## 👨‍💻 Sobre o Desenvolvedor
**Daniel** - Desenvolvedor Trainee | Estudante de Ciência da Computação.
Focado em criar soluções funcionais e escaláveis, aplicando conceitos de POO (Programação Orientada a Objetos) e boas práticas de desenvolvimento web.

---

## 🛠️ Tecnologias e Arquitetura

### Frontend (SPA)
- **React.js**: Construção de interfaces componentes e reativas.
- **Tailwind CSS**: Estilização responsiva com foco em performance visual.
- **Lucide React**: Biblioteca de ícones modernos.
- **React Router Dom**: Gestão de navegação e rotas protegidas.

### Backend (API)
- **Django**: Framework principal focado em segurança e rapidez de desenvolvimento.
- **Django REST Framework**: Camada de API para comunicação com o Frontend.
- **SQLite**: Banco de dados utilizado para desenvolvimento e prototipagem.

---

## 🔥 Desafios Técnicos Superados

Durante o desenvolvimento deste projeto, foquei na resolução de problemas complexos de integração:

- **Segurança CSRF**: Implementação de lógica para captura e envio de tokens CSRF entre o Django e o React, garantindo a segurança em requisições de modificação (POST/PUT).
- **Layout Administrativo**: Criação de um dashboard responsivo com controle de estados para Sidebars e Headers, resolvendo conflitos de posicionamento e camadas (z-index).
- **Configuração Dinâmica**: Desenvolvimento de um Contexto Global no React que consome configurações do backend (título, logo, metadados), permitindo que o administrador altere a identidade visual do site sem mexer no código.

---

## 📂 Estrutura do Projeto
```text
├── frontend/        # Código fonte React (Interface do usuário e Admin)
├── VetSite/         # Configurações centrais do Django
├── VetSiteApp/      # Lógica de negócio, modelos e views (API)
├── media/           # Uploads de imagens de produtos e logos
└── manage.py        # Orquestrador do Django
