# 🧠 Ryze AI Agent - Deterministic UI Generator

> AI-powered agent that converts natural language → working React UI using a fixed component library.

**Live Demo:** https://ryze-blond.vercel.app  
**Backend API:** https://ryze-6gr1.onrender.com  
**Demo Video:** https://youtu.be/SkdBbPvZnRA

**Developer:** Dhruv Gupta  
**Email:** dhruvgupta0506@gmail.com  
**LinkedIn:** https://www.linkedin.com/in/dhruv-gupta0506  
**GitHub:** https://github.com/Dhruv-Gupta0506

---

## 🎯 Overview

This project implements a multi-agent AI system that generates deterministic UIs from natural language using a fixed component library. The system ensures visual consistency by restricting the AI to a predefined set of 10 components.

**Key Features:**
- Multi-agent architecture (Planner → Generator → Explainer)
- Fixed component library (10 components, zero variability)
- Iterative modifications (not full rewrites)
- Live preview with code editing
- Version rollback
- Component whitelist security

---

## 🏗️ Architecture Overview

### Multi-Agent System

```
User Prompt → Planner → Generator → Explainer → Live Preview
```

**1. Planner Agent** (`backend/agents/planner.js`)
- Analyzes user intent
- Selects components from whitelist
- Outputs structured JSON plan

**2. Generator Agent** (`backend/agents/generator.js`)
- Converts plan to React JSX code
- Enforces component whitelist
- Handles incremental modifications

**3. Explainer Agent** (`backend/agents/explainer.js`)
- Explains AI decisions in plain English
- References component choices

---

## 🧱 Component System Design

**Fixed Component Library:** 10 deterministic components

| Component | Purpose | Props |
|-----------|---------|-------|
| Card | Container | `title`, `children` |
| Button | Actions | `text`, `color`, `onClick` |
| Input | Form fields | `label`, `placeholder`, `value`, `onChange` |
| Table | Data display | `headers`, `rows` |
| Navbar | Navigation | `logo`, `links[]` |
| Sidebar | Menus | `title`, `items[]` |
| Modal | Overlays | `title`, `isOpen`, `children` |
| Chart | Visualizations | `type`, `data[]`, `title` |
| Badge | Status | `text`, `variant` |
| Alert | Notifications | `type`, `message`, `title` |

**Key Constraints:**
- AI can only select/compose components
- No inline styles allowed
- No AI-generated CSS
- No new component creation

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+
- Google Gemini API Key ([Get one here](https://ai.google.dev/))

### Installation

**1. Clone Repository**
```bash
git clone https://github.com/Dhruv-Gupta0506/ryze-ai-ui-generator.git
cd ryze-ai-ui-generator
```

**2. Backend Setup**
```bash
cd backend
npm install
```

Create `.env` file in `backend/`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
PORT=5000
```

**3. Frontend Setup**
```bash
cd ../frontend
npm install
```

Create `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:5000
```

**4. Run Application**

Terminal 1 - Backend:
```bash
cd backend
npm start
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Open: http://localhost:5173

---

## 🛡️ Security & Validation

**Component Whitelist Enforcement:**
- Backend validation in `backend/validators/validateUI.js`
- Frontend validation in `frontend/src/components/WorkspacePanel.jsx`
- Only 10 allowed components: Card, Button, Input, Table, Navbar, Sidebar, Modal, Chart, Badge, Alert

**Prompt Injection Protection:**
- Detects malicious patterns (e.g., "ignore previous instructions")
- Input validation (1-500 characters)
- Error handling for API failures

---

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, Axios  
**Backend:** Node.js, Express, Google Gemini 2.5 Flash  
**Deployment:** Vercel (frontend), Render (backend)

---

## 📁 Project Structure

```
ryze-ai-agent/
├── backend/
│   ├── agents/
│   │   ├── planner.js          # Agent 1: Planning
│   │   ├── generator.js        # Agent 2: Code generation
│   │   └── explainer.js        # Agent 3: Explanation
│   ├── validators/
│   │   └── validateUI.js       # Security validation
│   ├── gemini.js               # Gemini API client
│   └── server.js               # Express server
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── library/        # Fixed component library
│   │   │   ├── ChatPanel.jsx   # Chat interface
│   │   │   └── WorkspacePanel.jsx # Code + preview
│   │   ├── App.jsx
│   │   └── App.css
│   └── index.html
└── README.md
```

---

## ⚠️ Known Limitations

1. **In-memory storage** - History lost on refresh
2. **No authentication** - Single-user demo
3. **Limited to 10 components** - By design for determinism
4. **Simple charts** - CSS-only visualization
5. **Gemini API rate limits** - Subject to free tier

---

## 🚀 What I'd Improve With More Time

1. **Diff view** between versions
2. **Component schema validation** 
3. **Streaming AI responses** for better UX
4. **Persistent storage** (IndexedDB/MongoDB)
5. **TypeScript** for type safety
6. **Testing** (Jest, Playwright)

---

## 📧 Contact

**Dhruv Gupta**  
Email: dhruvgupta0506@gmail.com  
LinkedIn: https://www.linkedin.com/in/dhruv-gupta0506  
GitHub: https://github.com/Dhruv-Gupta0506

---

**Built for Ryze AI Full-Stack Assignment**