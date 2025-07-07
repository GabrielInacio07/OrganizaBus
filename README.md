
## TCC

Desenvolvimento do Projeto de Conclusão de Curso
# OrganizaBus 🚌💳

Sistema de controle financeiro para transportes universitários, desenvolvido como Trabalho de Conclusão de Curso (TCC), com foco em facilitar a gestão de alunos, pagamentos e rotinas operacionais por parte dos motoristas e discentes.

## 📌 Descrição

O OrganizaBus é uma plataforma web que intermedia a relação entre motoristas e alunos vinculados a transportes universitários. O sistema permite o gerenciamento de usuários, geração de cobranças via PIX (Mercado Pago), controle de status de pagamento, além de facilitar a comunicação entre as partes envolvidas.

## 🎯 Objetivos

- Automatizar o controle financeiro do transporte universitário.
- Permitir que motoristas gerenciem alunos e pagamentos de forma simples e intuitiva.
- Oferecer aos alunos uma interface para acompanhar pagamentos e editar seus dados.
- Integrar métodos modernos de pagamento via QR Code PIX.

## 🚀 Funcionalidades

### 🔐 Autenticação
- Login e registro de motoristas e alunos
- Recuperação de senha por e-mail

### 👤 Painel do Motorista
- Cadastro, edição e exclusão de alunos
- Geração e acompanhamento de cobranças via PIX
- Visualização de status de pagamento de cada aluno
- Acesso ao perfil com dados pessoais

### 🎓 Painel do Aluno
- Visualização do status do pagamento
- Alteração de senha
- Acesso ao perfil e dados atualizados

### 💳 Integração com Mercado Pago
- Geração de cobranças por QR Code PIX
- Controle de status: "Não gerado", "Gerado", "Pago"

## 🖼️ Interfaces do Sistema

| Tela | Descrição |
|------|-----------|
| ![Login](./images/login_tcc.png) | Tela de login |
| ![Home](./images/home_tcc.png) | Tela inicial |
| ![Cadastro Motorista](./images/cadastro_motorista_tcc.png) | Cadastro de motorista |
| ![Painel Motorista](./images/tela_Motorista_tcc.png) | Painel com ações de motorista |
| ![Cadastro Aluno](./images/tela_cadastrar_aluno.png) | Cadastro de alunos |
| ![QR Code PIX](./images/QR-code-pagamento.png) | Geração de QR Code de pagamento |
| ![Painel Aluno](./images/tela_aluno_tcc.png) | Painel com status de pagamento |
| ![Perfil Motorista](./images/perfil_motorista_tcc.png) | Dados do motorista |
| ![Perfil Aluno](./images/perfil_aluno_tcc.png) | Dados do aluno |

## 🛠️ Tecnologias Utilizadas

- **Frontend**: Next.js, React.js, Tailwind CSS
- **Backend**: Node.js (API Routes do Next.js)
- **Banco de Dados**: MySQL com Prisma ORM
- **Autenticação**: Local (via sessions), com envio de senha por e-mail (Nodemailer)
- **Pagamentos**: Mercado Pago - Integração PIX
- **Hospedagem**: Pode ser hospedado em Vercel, Railway ou similar
