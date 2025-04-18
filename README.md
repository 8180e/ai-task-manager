# 🧠 AI-Powered Task Manager

**Live Demo:** https://ai-task-manager-inky.vercel.app

A personalized task management web app that uses **AI-driven prioritization** to help users organize their lives more efficiently. This project integrates modern web development practices with natural language processing to intelligently prioritize tasks based on urgency, complexity, and deadlines.

## 🚀 Features

### ✅ User Authentication

- Sign up, log in, and manage sessions securely
- JWT-based authentication for stateless access

### 📝 Task Management

- **CRUD operations** for tasks
- Organize tasks by **category** (Work, Personal, etc.)
- Add **due dates**, **status** and **urgency**

### 🔍 AI-Driven Prioritization

- Dedicated **NLP API (Flask + spaCy)** for analyzing task descriptions
- Assigns priority based on:
  - Keywords (`urgent`, `ASAP`, etc.)
  - Deadlines & due dates

### 📅 Calendar View

- Calendar display of tasks
- Color-coded by priority
- Filter by date, category, or priority level

### 🔔 Smart Notifications

- In-app reminders for upcoming or overdue tasks

---

## 🛠 Tech Stack

| Layer              | Tech                     |
| ------------------ | ------------------------ |
| **Frontend**       | React (with Material UI) |
| **Backend API**    | Node.js + Express        |
| **NLP API**        | Python (Flask) + spaCy   |
| **Database**       | MongoDB                  |
| **Authentication** | JWT                      |
| **Calendar**       | FullCalendar.js          |

---

## 🧠 How AI Prioritization Works

The **NLP API** uses spaCy and rule-based logic to prioritize tasks by:

- Scanning task **descriptions** for urgency cues
- Considering **deadlines** and user-defined **complexity**
- Returning a structured **priority label** ("Urgent" or "Normal")

> Example:  
> _"Fix production bug by 5 PM today"_ → **Urgent**

---

## 🧪 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/8180e/ai-task-manager.git
cd ai-task-manager
```

---

### 2. Install Dependencies

#### Backend (Node.js + Express)

```bash
cd backend
npm install
```

#### Frontend (React)

```bash
cd ../frontend
npm install
```

#### NLP API (Flask + spaCy)

```bash
cd ../nlp-api
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

---

### 3. Environment Variables

#### Backend (`backend/.env`)

```
PORT=3000
MONGODB_URI=your_mongodb_uri
TOKEN_SECRET=your_jwt_token_secret
NLP_API_URL=http://localhost:5000
FRONTEND_URLS=http://localhost:5173
```

#### Frontend (`frontend/.env`)

```
VITE_BACKEND_URL=http://localhost:3000
```

---

### 4. Run the App

#### Run NLP API

```bash
cd nlp-api
source venv/bin/activate # or venv\Scripts\activate on Windows
python app.py
```

#### Run Backend API

```bash
cd backend
npm run dev
```

#### Run Frontend

```bash
cd frontend
npm run dev
```

---

## 📂 Folder Structure

```
ai-task-manager/
├── backend/              # Node.js/Express backend API
│   ├── src/
│      ├── config/
│      ├── controllers/
│      ├── middlewares/
│      ├── models/
│      ├── routes/
│      ├── services/
│      ├── utils/
│      ├── app.ts
│      └── index.ts
│   ├── tests/
│      ├── integration/
│      └─ unit/
├── frontend/             # React client
│   ├── src/
│      ├── components/
│      ├── pages/
│      ├── utils/
│      ├── tests/
│      ├── App.tsx
│      └── main.tsx
├── nlp-api/              # Flask + spaCy NLP service
│   ├── app.py
│   ├── priority_system_keywords.json
│   ├── priority_system.py
│   └── requirements.txt
└── README.md
```

---

## 📜 License

MIT License. Use, modify, and distribute freely.

---

## ✨ Why This Project?

This project showcases:

- Full-stack app development
- API communication between services
- Practical NLP integration with Flask
- Clean architecture & modular AI design
- Real-world value & personal productivity impact
