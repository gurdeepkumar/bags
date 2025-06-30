
# 💰 Bags – Crypto Portfolio Tracker

**Bags** is a full-stack cryptocurrency portfolio tracking application built with a modern React frontend and a FastAPI backend. It features secure user authentication, real-time balance tracking, and backend deployed on AWS infrastructure.

---

## 🚀 Tech Stack

### 🖥️ Frontend

- **Framework**: React 19 with Vite  
- **State Management**: Redux Toolkit + React Redux  
- **Routing**: React Router DOM v7  
- **Forms & Validation**: Formik + Yup  
- **UI/UX**: TailwindCSS 4, React Spring for animations, React Hot Toast for notifications  
- **Networking**: Axios for API communication  
- **Auth**: JWT decode for client-side token handling  

### ⚙️ Backend (FastAPI)

- **Framework**: FastAPI (Python 3.11), serving asynchronous, high-performance REST APIs  
- **Authentication**: JWT (access + refresh tokens) with `python-jose`, password hashing with `Passlib[bcrypt]`  
- **Database**: PostgreSQL (hosted on AWS Lightsail)  
- **ORM & Migrations**: SQLAlchemy with async support, Alembic for schema migration management  
- **Validation & Serialization**: Pydantic models for strong type checking and request validation  
- **API Calls**: `httpx` used for async external API requests  
- **Background Tasks**:
  - Implemented with **Celery** and **Redis** for queuing and scheduling jobs  
  - Periodically fetches **real-time cryptocurrency prices** and stores them in the redis DB  
  - Uses the **Binance API**, selected over CoinMarketCap/Coingecko due to:
    - No strict rate limits on free tier  
    - Access to **real-time market data**, not delayed snapshots  
    - Simplified integration with current system design  

- **Configuration**: `.env` and `python-dotenv` used for secure environment-based settings  
- **Async-Ready**: Entire backend stack designed to be fully async-compatible for scalability and performance  

### ☁️ Infrastructure

- **Deployment**: FastAPI served via Uvicorn  
- **Hosting**: AWS Lightsail (PostgreSQL and Redis managed services)  
- **Configuration**: Secure `.env` handling for all secrets and environment-specific variables   
- **CI/CD (optional)**: ****** Can be integrated via GitHub Actions or Docker Hub pipelines ******

---

## 🧠 Architecture Highlights

### Frontend

- Modular, atomic component structure  
- Optimistic UI updates and loading skeletons  
- Global store managed via Redux slices  
- Secure route guards and protected views  
- Mobile-responsive and keyboard accessible  

### Backend

- RESTful API endpoints with clear versioning  
- Stateless JWT auth with refresh token rotation support  
- Background tasks via Celery (e.g., price syncing, email notifications)  
- Redis-backed job queue and caching  

---

## ✨ Core Features

- Secure user authentication (register/login/logout)  
- Add, update, and track crypto assets
- Real-time price updates (via background jobs)   
- Fully responsive and accessible interface  
