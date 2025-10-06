# 🌍 Aura Air App - Air Quality Monitoring System

<div align="center">

<img src="https://i.ibb.co/xSgrzNVt/logo-aura.png" alt="Air Aura Logo" width="150"/>

**An intelligent platform for air quality monitoring and forecasting using NASA data and Machine Learning**

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?style=for-the-badge\&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.118.0-green?style=for-the-badge\&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.12-blue?style=for-the-badge\&logo=python)](https://python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge\&logo=typescript)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue?style=for-the-badge\&logo=docker)](https://docker.com/)
[![Railway](https://img.shields.io/badge/Deployed%20on-Railway-blue?style=for-the-badge)](https://railway.app/)
[![Netlify](https://img.shields.io/badge/Deployed%20on-Netlify-green?style=for-the-badge)](https://netlify.com/)

</div>

## 📋 Table of Contents

* [🎯 About the Project](#-about-the-project)
* [✨ Features](#-features)
* [🏗️ Architecture](#️-architecture)
* [🚀 Technologies](#-technologies)
* [📦 Installation](#-installation)
* [🐳 Docker](#-docker)
* [🌐 Deployment](#-deployment)
* [👥 Contributors](#-contributors)
* [📄 License](#-license)

## 🎯 About the Project

**Aura Air App** is a complete web application designed for real-time monitoring of air quality (AQI - Air Quality Index).
The platform uses NASA meteorological data, Machine Learning algorithms (XGBoost), and artificial intelligence to deliver accurate and personalized air quality forecasts.

### 🎯 Goals

* **Real-Time Monitoring**: Track air quality in any geographic location
* **Smart Forecasting**: ML algorithms for 15-day AQI predictions
* **Personalization**: Health profiles for more accurate alerts
* **Accessibility**: Responsive and mobile-friendly interface
* **Smart Chatbot**: Virtual assistant specialized in air quality

## ✨ Features

### 🔍 Monitoring

* **Real-Time AQI**: Updated data from NASA and OpenWeather
* **Geographic Monitoring**: Accurate GPS-based tracking
* **Data History**: Analyze trends and historical patterns
* **Personalized Alerts**: Notifications based on user health profile

### 🤖 Artificial Intelligence

* **Specialized Chatbot**: Virtual assistant for air quality questions
* **ML Predictions**: XGBoost algorithm for 15-day forecasts
* **Personalized Analysis**: Alerts tailored to health conditions

### 👤 User Management

* **Secure Authentication**: JWT-based login/register system
* **Health Profiles**: Configuration for medical conditions and sensitivities
* **Personal History**: Individual exposure tracking

### 📱 Modern Interface

* **Responsive Design**: Optimized for desktop and mobile
* **Dark/Light Theme**: Switchable themes
* **Interactive Components**: Charts, maps, and dynamic visualizations

## 🏗️ Architecture

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

## 🚀 Technologies

### Frontend

* **Next.js 15.2.4** – React framework with SSR/SSG
* **React 19** – UI library
* **TypeScript 5.0** – Static typing
* **Tailwind CSS** – Utility-first CSS framework
* **Shadcn/ui** – UI component library
* **Framer Motion** – Animations
* **Recharts** – Charts and data visualization

### Backend

* **Python 3.12** – Programming language
* **FastAPI 0.118.0** – Modern web framework
* **SQLAlchemy 2.0.43** – Database ORM
* **MySQL 8.0** – Relational database
* **Pydantic** – Data validation
* **Uvicorn** – ASGI server

### Machine Learning

* **XGBoost 3.0.5** – ML algorithm for predictions
* **Pandas 2.3.3** – Data manipulation
* **NumPy 2.3.3** – Numerical computation
* **Scikit-learn** – ML tools

### DevOps & Deployment

* **Docker** – Containerization
* **Railway** – Backend deployment
* **Netlify** – Frontend deployment
* **Git** – Version control

## 📦 Installation

### Prerequisites

* **Node.js** 18+
* **Python** 3.12+
* **MySQL** 8.0+
* **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/aura-air-app.git
cd aura-air-app
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
```

Create a `.env` file:

```env
DATABASE_URL=mysql://user:password@host:port/database
NASA_API_KEY=your_nasa_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
```

### 3. Frontend Setup

```bash
cd frontend
npm install
# or
yarn install
# or
pnpm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### 4. Database Setup

```bash
# Configure MySQL and credentials in backend .env
# Run migrations if needed:
# python -m alembic upgrade head
```

### 5. Run the Application

#### Backend

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### 6. Access the App

* **Website**: [https://air-aurea.netlify.app/login](https://air-aurea.netlify.app/login)

## 🐳 Docker

### Run with Docker Compose

```bash
docker-compose up --build
# or run in background:
docker-compose up -d --build
```

### Individual Docker Commands

```bash
cd backend
docker build -t aura-air-backend .
docker run -p 8000:8000 aura-air-backend

cd ../frontend
docker build -t aura-air-frontend .
docker run -p 3000:3000 aura-air-frontend
```

## 🌐 Deployment

### Backend (Railway)

1. **Connect the repository** to Railway
2. **Set environment variables**:

   ```env
   DATABASE_URL=mysql://user:password@host:port/database
   NASA_API_KEY=your_nasa_api_key
   OPENWEATHER_API_KEY=your_openweather_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```
3. **Automatic deploy** via Git push

### Frontend (Netlify)

1. **Connect the repository** to Netlify
2. **Set build options**:

   * Build command: `npm run build`
   * Publish directory: `frontend/.next`
3. **Set environment variables**:

   ```env
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   ```
4. **Automatic deploy** via Git push

### Required Environment Variables

#### Backend (.env)

```env
DATABASE_URL=mysql://user:password@host:port/database
NASA_API_KEY=your_nasa_api_key
OPENWEATHER_API_KEY=your_openweather_api_key
OPENWEATHER_API_URL=https://api.openweathermap.org/data/2.5
GEMINI_API_KEY=your_gemini_api_key
OPENAQ_API=https://api.openaq.org/v2
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

#### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_APP_NAME=Aura Air App
```

## 👥 Contributors

### Development Team

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/github.png" width="100px;" alt="Professor Clênio"/>
      <br />
      <sub><b>Professor Clênio</b></sub>
      <br />
      <sub>💻 Full-stack</sub>
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
      <img src="https://github.com/github.png" width="100px;" alt="Victor Hugo"/>
      <br />
      <sub><b>Victor Hugo</b></sub>
      <br />
      <sub>💻 Full-stack</sub>
    </td>
  </tr>
</table>

### Team Contributions

* **Professor Clênio**: Full-stack development, architecture, integrations, components, UI/UX, backend, APIs
* **Miguel Eustáquio**: Full-stack development, architecture, integrations, components, UI/UX, backend, APIs
* **Luiz Miguel**: Full-stack development, architecture, integrations, components, UI/UX, backend, APIs
* **Pedro Evangelista**: Full-stack development, architecture, integrations, components, UI/UX, backend, APIs
* **Pedro Fonseca**: Full-stack development, architecture, integrations, components, UI/UX, backend, APIs
* * **Victor Hugo**: Full-stack development, architecture, integrations, components, UI/UX, backend, APIs

## 📊 Project Stats

![GitHub repo size](https://img.shields.io/github/repo-size/your-username/aura-air-app?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/your-username/aura-air-app?style=for-the-badge)
![GitHub top language](https://img.shields.io/github/languages/top/your-username/aura-air-app?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/your-username/aura-air-app?style=for-the-badge)

## 🤝 Contributing

1. **Fork** the project
2. **Create** a feature branch (`git checkout -b feature/new-feature`)
3. **Commit** your changes (`git commit -m 'Add new feature'`)
4. **Push** to your branch (`git push origin feature/new-feature`)
5. **Open** a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

<div align="center">

**Developed with ❤️ for cleaner and healthier air**

![NASA](https://img.shields.io/badge/NASA-Space%20Apps-blue?style=for-the-badge\&logo=nasa)
![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)

</div>
