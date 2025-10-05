# 🌍 Aura Air App - Sistema de Monitoramento de Qualidade do Ar

<div align="center">

![Air Aura Logo](https://i.ibb.co/xSgrzNVt/logo-aura.png)

**Uma plataforma inteligente para monitoramento e previsão da qualidade do ar usando dados da NASA e Machine Learning**

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.118.0-green?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.12-blue?style=for-the-badge&logo=python)](https://python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue?style=for-the-badge&logo=docker)](https://docker.com/)
[![Railway](https://img.shields.io/badge/Deployed%20on-Railway-blue?style=for-the-badge)](https://railway.app/)
[![Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-green?style=for-the-badge)](https://netlify.com/)

</div>

## 📋 Índice

- [🎯 Sobre o Projeto](#-sobre-o-projeto)
- [✨ Funcionalidades](#-funcionalidades)
- [🏗️ Arquitetura](#️-arquitetura)
- [🚀 Tecnologias](#-tecnologias)
- [📦 Instalação](#-instalação)
- [🐳 Docker](#-docker)
- [🌐 Deploy](#-deploy)
- [📱 Screenshots](#-screenshots)
- [👥 Colaboradores](#-colaboradores)
- [📄 Licença](#-licença)

## 🎯 Sobre o Projeto

O **Aura Air App** é uma aplicação web completa desenvolvida para monitoramento em tempo real da qualidade do ar (AQI - Air Quality Index). A plataforma utiliza dados meteorológicos da NASA, algoritmos de Machine Learning (XGBoost) e inteligência artificial para fornecer previsões precisas e personalizadas da qualidade do ar.

### 🎯 Objetivos

- **Monitoramento em Tempo Real**: Acompanhe a qualidade do ar em qualquer localização geográfica
- **Previsões Inteligentes**: Algoritmos de ML para previsões de AQI nos próximos 15 dias
- **Personalização**: Perfis de saúde personalizados para alertas mais precisos
- **Acessibilidade**: Interface responsiva e otimizada para dispositivos móveis
- **Chatbot Inteligente**: Assistente virtual especializado em qualidade do ar

## ✨ Funcionalidades

### 🔍 Monitoramento
- **AQI em Tempo Real**: Dados atualizados da NASA e OpenWeather
- **Monitoramento Geográfico**: Localização precisa via coordenadas GPS
- **Histórico de Dados**: Análise de tendências e padrões históricos
- **Alertas Personalizados**: Notificações baseadas no perfil de saúde do usuário

### 🤖 Inteligência Artificial
- **Chatbot Especializado**: Assistente virtual para dúvidas sobre qualidade do ar
- **Previsões ML**: Algoritmo XGBoost para previsões de 15 dias
- **Análise Personalizada**: Ajuste de alertas baseado em condições de saúde

### 👤 Gestão de Usuários
- **Autenticação Segura**: Sistema de login/cadastro com JWT
- **Perfis de Saúde**: Configuração de condições médicas e sensibilidades
- **Histórico Personalizado**: Acompanhamento individual de exposição

### 📱 Interface Moderna
- **Design Responsivo**: Otimizado para desktop e mobile
- **Tema Escuro/Claro**: Alternância de temas
- **Componentes Interativos**: Gráficos, mapas e visualizações dinâmicas

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   External      │
│   (Next.js)     │◄──►│   (FastAPI)     │◄──►│   APIs          │
│                 │    │                 │    │                 │
│ • React 19      │    │ • Python 3.12   │    │ • NASA APIs     │
│ • TypeScript    │    │ • FastAPI       │    │ • OpenWeather   │
│ • Tailwind CSS  │    │ • SQLAlchemy    │    │ • Gemini AI     │
│ • Shadcn/ui     │    │ • MySQL         │    │ • OpenAQ        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │
        │                       │
        ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│    Netlify      │    │    Railway      │
│   (Frontend)    │    │   (Backend)     │
└─────────────────┘    └─────────────────┘
```

## 🚀 Tecnologias

### Frontend
- **Next.js 15.2.4** - Framework React com SSR/SSG
- **React 19** - Biblioteca de interface de usuário
- **TypeScript 5.0** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/ui** - Componentes de interface
- **Framer Motion** - Animações
- **Recharts** - Gráficos e visualizações

### Backend
- **Python 3.12** - Linguagem de programação
- **FastAPI 0.118.0** - Framework web moderno
- **SQLAlchemy 2.0.43** - ORM para banco de dados
- **MySQL 8.0** - Banco de dados relacional
- **Pydantic** - Validação de dados
- **Uvicorn** - Servidor ASGI

### Machine Learning
- **XGBoost 3.0.5** - Algoritmo de ML para previsões
- **Pandas 2.3.3** - Manipulação de dados
- **NumPy 2.3.3** - Computação numérica
- **Scikit-learn** - Ferramentas de ML

### DevOps & Deploy
- **Docker** - Containerização
- **Railway** - Deploy do backend
- **Netlify** - Deploy do frontend
- **Git** - Controle de versão

## 📦 Instalação

### Pré-requisitos

- **Node.js** 18+ 
- **Python** 3.12+
- **MySQL** 8.0+
- **Git**

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/aura-air-app.git
cd aura-air-app
```

### 2. Configuração do Backend

```bash
# Navegue para a pasta do backend
cd backend

# Crie um ambiente virtual
python -m venv venv

# Ative o ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Configure as variáveis de ambiente
# Crie um arquivo .env com suas configurações
# Exemplo de estrutura:
# DATABASE_URL=mysql://user:password@host:port/database
# NASA_API_KEY=sua_api_key_da_nasa
# OPENWEATHER_API_KEY=sua_api_key_do_openweather
```

### 3. Configuração do Frontend

```bash
# Navegue para a pasta do frontend
cd frontend

# Instale as dependências
npm install
# ou
yarn install
# ou
pnpm install

# Configure as variáveis de ambiente
# Crie um arquivo .env.local com suas configurações
# Exemplo de estrutura:
# NEXT_PUBLIC_API_URL=https://seu-backend-url.com
```

### 4. Configuração do Banco de Dados

```bash
# Configure o banco de dados MySQL
# Configure as credenciais no arquivo .env do backend

# Execute as migrações (se necessário)
# python -m alembic upgrade head
```

### 5. Executar a Aplicação

#### Backend
```bash
# No diretório backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend
```bash
# No diretório frontend
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

### 6. Acessar a Aplicação

- **Website**: https://air-aurea.netlify.app/login

## 🐳 Docker

### Executar com Docker Compose

```bash
# No diretório raiz do projeto
docker-compose up --build

# Para executar em background
docker-compose up -d --build
```

### Comandos Docker Individuais

```bash
# Build da imagem do backend
cd backend
docker build -t aura-air-backend .

# Executar o container
docker run -p 8000:8000 aura-air-backend

# Build da imagem do frontend
cd ../frontend
docker build -t aura-air-frontend .

# Executar o container
docker run -p 3000:3000 aura-air-frontend
```

## 🌐 Deploy

### Backend (Railway)

1. **Conecte o repositório** ao Railway
2. **Configure as variáveis de ambiente**:
   ```
   DATABASE_URL=mysql://user:password@host:port/database
   NASA_API_KEY=sua_api_key_da_nasa
   OPENWEATHER_API_KEY=sua_api_key_do_openweather
   GEMINI_API_KEY=sua_api_key_do_gemini
   ```
3. **Deploy automático** via Git push

### Frontend (Netlify)

1. **Conecte o repositório** ao Netlify
2. **Configure o build**:
   - Build command: `npm run build`
   - Publish directory: `frontend/.next`
3. **Configure as variáveis de ambiente**:
   ```
   NEXT_PUBLIC_API_URL=https://seu-backend.railway.app
   ```
4. **Deploy automático** via Git push

### Variáveis de Ambiente Necessárias

#### Backend (.env)
```env
DATABASE_URL=mysql://user:password@host:port/database
NASA_API_KEY=sua_api_key_da_nasa
OPENWEATHER_API_KEY=sua_api_key_do_openweather
OPENWEATHER_API_URL=https://api.openweathermap.org/data/2.5
GEMINI_API_KEY=sua_api_key_do_gemini
OPENAQ_API=https://api.openaq.org/v2
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://seu-backend.railway.app
NEXT_PUBLIC_APP_NAME=Aura Air App
```

## 📱 Screenshots

### Dashboard Principal
![Dashboard](https://via.placeholder.com/800x400/1e40af/ffffff?text=Dashboard+Aura+Air)

### Monitoramento AQI
![AQI Monitor](https://via.placeholder.com/800x400/16a34a/ffffff?text=Monitoramento+AQI)

### Chatbot Inteligente
![Chatbot](https://via.placeholder.com/800x400/9333ea/ffffff?text=Chatbot+Inteligente)

### Previsões ML
![ML Predictions](https://via.placeholder.com/800x400/dc2626/ffffff?text=Previs%C3%B5es+Machine+Learning)

## 👥 Colaboradores

### Equipe de Desenvolvimento

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/github.png" width="100px;" alt="Professor Clênio"/>
      <br />
      <sub><b>Professor Clênio</b></sub>
      <br />
      <sub>👨‍🏫 Mentor</sub>
    </td>
    <td align="center">
      <img src="https://github.com/github.png" width="100px;" alt="Miguel Eustáquio"/>
      <br />
      <sub><b>Miguel Eustáquio</b></sub>
      <br />
      <sub>💻 Full-stack</sub>
    </td>
    <td align="center">
      <img src="https://github.com/github.png" width="100px;" alt="Luiz Miguel"/>
      <br />
      <sub><b>Luiz Miguel</b></sub>
      <br />
      <sub>💻 Full-stack</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/github.png" width="100px;" alt="Pedro Evangelista"/>
      <br />
      <sub><b>Pedro Evangelista</b></sub>
      <br />
      <sub>💻 Full-stack</sub>
    </td>
    <td align="center">
      <img src="https://github.com/github.png" width="100px;" alt="Pedro Fonseca"/>
      <br />
      <sub><b>Pedro Fonseca</b></sub>
      <br />
      <sub>💻 Full-stack</sub>
    </td>
    <td align="center">
      <img src="https://github.com/github.png" width="100px;" alt="Gustavo"/>
      <br />
      <sub><b>Gustavo</b></sub>
      <br />
      <sub>💻 Full-stack</sub>
    </td>
  </tr>
</table>

### Contribuições da Equipe

- **Professor Clênio**: Mentoria e orientação técnica do projeto
- **Miguel Eustáquio**: Desenvolvimento full-stack, arquitetura, integrações, componentes, funcionalidades, interface, UX, backend e APIs.
- **Luiz Miguel**: Desenvolvimento full-stack, arquitetura, integrações, componentes, funcionalidades, interface, UX, backend e APIs.
- **Pedro Evangelista**: Desenvolvimento full-stack, arquitetura, integrações, componentes, funcionalidades, interface, UX, backend e APIs.
- **Pedro Fonseca**: Desenvolvimento full-stack, arquitetura, integrações, componentes, funcionalidades, interface, UX, backend e APIs.
- **Gustavo**: Desenvolvimento full-stack, arquitetura, integrações, componentes, funcionalidades, interface, UX, backend e APIs.

## 📊 Estatísticas do Projeto

![GitHub repo size](https://img.shields.io/github/repo-size/seu-usuario/aura-air-app?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/seu-usuario/aura-air-app?style=for-the-badge)
![GitHub top language](https://img.shields.io/github/languages/top/seu-usuario/aura-air-app?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/seu-usuario/aura-air-app?style=for-the-badge)

## 🤝 Contribuindo

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. **Commit** suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. **Push** para a branch (`git push origin feature/nova-feature`)
5. **Abra** um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

**Desenvolvido com ❤️ para um ar mais limpo e saudável**

![NASA](https://img.shields.io/badge/NASA-Space%20Apps-blue?style=for-the-badge&logo=nasa)
![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)

</div>

