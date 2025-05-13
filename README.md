# 🤰🏾 Mama Africa - Maternity Companion for African Mums

**Mama Africa** is a culturally-grounded maternity platform designed to empower African mothers with personalized pregnancy tracking, localised content, expert Q&A, community support, and health resource recommendations.

---

## 🌍 Features

### 🧑‍⚕️ For Mums
- Track pregnancy milestones (auto-calculates EDD & weekly updates)
- Ask health professionals questions
- Join trimester-based communities
- Get nutritional advice with seasonal local foods
- Upload scans and manage medical reminders
- Follow topics by trimester

### 👩🏽‍⚕️ For Health Professionals
- Request verification (with license check)
- Post articles (reviewed by admin)
- Answer mum questions and view scans
- Recommend trusted clinics
- Flag misinformation

### 🛡️ For Admins
- Approve/reject flagged content
- Manage all users and verify professionals
- View statistics and send notifications
- Moderate community posts and comments

---

## 🛠️ Tech Stack

| Component        | Tech                                                                 |
|------------------|----------------------------------------------------------------------|
| Frontend         | React + Vite + Tailwind + Axios + Socket.IO                          |
| Backend          | Flask + Flask-SocketIO + SQLAlchemy + JWT + Flask-CORS               |
| Database         | PostgreSQL                                                           |
| Real-Time        | WebSockets (chat, notifications, Q&A)                                |
| Deployment       | Render (Backend) + Vercel/Netlify (Frontend)                         |

---

## 🚀 Getting Started

### 🔧 Prerequisites
- Node.js (v16+)
- Python (v3.10+)
- PostgreSQL
- Virtualenv (optional)

### 🧪 Backend Setup

```bash
# Clone repo and enter server directory
cd server
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate for Windows
pip install -r requirements.txt

# Setup environment variables
cp .env.example .env
# Edit .env to match your DB credentials

# Run migrations & seed data
flask db upgrade
python seed.py

# Start backend
python app.py
