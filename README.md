# AI Assistant Task Manager (Frontend)

A chat-based AI task management app built with **React, TypeScript, and Vite**.  
Interact with an AI assistant that can add, list, complete, edit, and delete tasks using natural language — with **real-time streaming responses**.

**Live Demo:** [https://tasky22.vercel.app/](https://tasky22.vercel.app/)

---

## 🚀 Features

- 💬 AI-powered chat interface  
- ⚡ Streaming responses using **Server-Sent Events (SSE)**  
- 🗂 Multiple chat threads with unique thread IDs  
- 📝 Task CRUD: Add, List, Complete, Edit, Delete  
- 📊 Markdown tables for task lists  
- 🧠 Friendly AI prompts and summaries  
- ⚛️ Clean, modern UI with React + TypeScript  

---

## 📦 Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **Backend server** running (see setup below)

### Frontend Setup

Clone the repository:
```bash
git clone https://github.com/babs12316/AI-Assistant-Task-Manager-Frontend.git
cd AI-Assistant-Task-Manager-Frontend
```

Install dependencies:
```bash
npm install
```

---

## 🔧 Backend Setup

This frontend requires the backend API to be running. Follow these steps:

### 1. Clone the Backend Repository
```bash
git clone https://github.com/babs12316/AI-Assistant-Task-Manager-Backend.git
cd AI-Assistant-Task-Manager-Backend
```

### 2. Follow Backend Setup Instructions

For detailed backend setup, configuration, and API documentation, visit:

👉 **[Backend Repository](https://github.com/babs12316/AI-Assistant-Task-Manager-Backend)**

The backend provides:
- LangChain-powered AI agent
- Task management tools (Add, List, Complete, Edit, Delete)
- SSE streaming endpoints
- FastAPI server

---

## 🔧 Environment Variables

Create a `.env` file in the **frontend** project root:
```env
VITE_API_URL=http://localhost:8000  # Your backend URL
```

> **Note:** Make sure the backend server is running at the specified URL before starting the frontend.

---

## 🎯 Usage

### Start Backend Server (Terminal 1)
```bash
cd AI-Assistant-Task-Manager-Backend
uvicorn src.api:app --reload
```

Backend will run at: `http://localhost:8000`

### Start Frontend Dev Server (Terminal 2)
```bash
cd AI-Assistant-Task-Manager-Frontend
npm run dev
```

Frontend will run at: `http://localhost:5173`

Open your browser at:
```
http://localhost:5173
```

---

## 💡 How It Works

1. **User types a message** in the chat UI (e.g., "Add gym at 6pm")
2. **Frontend sends** the message to the backend via `fetchEventSource`
3. **Backend AI agent** processes the request using LangChain tools
4. **Backend streams tokens** via SSE back to the frontend
5. **Messages appear in real-time**, token by token
6. **Tasks are managed** in backend memory with thread persistence

---

## 📝 Example Commands

| User Input Example      | What It Does              |
| ----------------------- | ------------------------- |
| `Add gym at 6pm`        | Adds a task with time tag |
| `Show me today's tasks` | Lists tasks due today     |
| `Complete gym`          | Marks task as complete    |
| `Edit lunch to 2pm`     | Updates an existing task  |
| `Delete gym`            | Removes the task          |

---

## 📚 Tech Stack

### Frontend
- **React** + **TypeScript**
- **Vite** (fast bundler)
- **React Markdown** for formatted messages
- **@microsoft/fetch-event-source** for SSE streaming
- **CSS** for a simple, modern UI

### Backend
- **FastAPI** (Python)
- **LangChain** + **LangGraph** for AI agent orchestration
- **Groq API** for LLM inference
- **Server-Sent Events (SSE)** for real-time streaming

For backend details, see: [Backend Repository](https://github.com/babs12316/AI-Assistant-Task-Manager-Backend)

---

## 🏗️ Project Structure
```
AI-Assistant-Task-Manager-Frontend/
├── src/
│   ├── App.tsx           # Main chat component
│   ├── App.css           # Styling
│   └── main.tsx          # Entry point
├── .env                  # Environment variables
├── package.json          # Dependencies
└── README.md             # This file
```

---

## 🐛 Troubleshooting

### Backend Connection Error

If you see "Connection failed" errors:

1. ✅ Check backend is running: `http://localhost:8000/health`
2. ✅ Verify `VITE_API_URL` in `.env` matches backend URL
3. ✅ Check CORS settings in backend allow frontend origin

### No Response from AI

1. ✅ Verify backend has valid Groq API key configured
2. ✅ Check backend console for error logs
3. ✅ Ensure backend tools are properly registered

---

## 🔗 Related Repositories

- **Backend Repository**: [AI-Assistant-Task-Manager-Backend](https://github.com/babs12316/AI-Assistant-Task-Manager-Backend)

---

**⭐ If you like this project, give it a star on GitHub!**