# Ryze AI - UI Generator

> AI-powered UI generator with deterministic components using multi-agent architecture

## 🎯 Project Overview

This is an AI agent that converts natural language → working React UI using a **fixed, deterministic component library**. Built with Gemini AI, React, and Express.

**Live Demo:** [Your deployed URL here]

---

## 🏗️ Architecture

### Multi-Agent Pipeline
```
User Prompt → Planner → Generator → Validator → Explainer → UI Render
```

1. **Planner** (`backend/agents/planner.js`)
   - Analyzes user intent
   - Chooses components and layout
   - Preserves existing UI for incremental edits

2. **Generator** (`backend/agents/generator.js`)
   - Converts plan into JSON schema
   - Uses only whitelisted components
   - Outputs deterministic structure

3. **Validator** (`backend/agents/validator.js`)
   - Enforces component whitelist
   - Blocks unauthorized components
   - Validates schema structure

4. **Explainer** (`backend/agents/explainer.js`)
   - Explains AI decisions in plain English
   - References component choices

---

## 🧱 Fixed Component Library

The system uses **10 deterministic components**:

| Component | Props | Purpose |
|-----------|-------|---------|
| Card | title | Container |
| Button | text, color | Actions |
| Input | label, placeholder | Form fields |
| Table | headers, rows | Data display |
| Navbar | logo, links | Navigation |
| Sidebar | title, items | Menus |
| Modal | title, isOpen | Overlays |
| Chart | type, data, title | Visualizations |
| Badge | text, variant | Status |
| Alert | type, message, title | Notifications |

**Code:** `frontend/src/components/library/`

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Gemini API Key

### Installation
```bash
# 1. Clone repository
git clone <your-repo-url>
cd ryze-ai-project

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install

# 4. Setup environment variables
cd ../backend
cp .env.example .env
# Add your GEMINI_API_KEY to .env
```

### Run Locally
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

Visit: `http://localhost:5173`

---

## 🛡️ Safety & Validation

### Component Whitelist
- Only 10 components allowed
- Validator blocks unauthorized components
- Frontend + backend validation

### Prompt Protection
- Length limits (500 chars)
- Injection pattern detection
- Error handling

---

## ✨ Features

✅ **Multi-agent AI** (Planner → Generator → Explainer)  
✅ **Deterministic components** (10 fixed components)  
✅ **Iterative editing** (AI modifies, not regenerates)  
✅ **Live preview** with instant rendering  
✅ **Version rollback** to previous states  
✅ **Code editing** with real-time updates  
✅ **Safety validation** with whitelist enforcement  

---

## 📝 Example Prompts

Try these:
```
"Create a user dashboard with stats and a data table"
"Add a modal with a form for user settings"
"Make a landing page with a navbar and hero section"
"Show a chart of monthly sales data"
```

---

## 🧪 Testing

### Manual Testing
1. Generate a basic UI
2. Ask to modify it incrementally
3. Try rollback feature
4. Edit code manually
5. Test with invalid components

---

## 📦 Tech Stack

- **Frontend:** React + Vite + Tailwind
- **Backend:** Node.js + Express
- **AI:** Google Gemini 2.5 Flash
- **Storage:** In-memory (no database)

---

## 🚧 Known Limitations

1. **No database** - Uses in-memory storage
2. **Simple validation** - Basic security checks
3. **Limited components** - 10 components (by design)
4. **No authentication** - Single-user demo
5. **Chart mocking** - Charts are simplified

---

## 🎯 What I'd Improve

### With More Time
- [ ] TypeScript for type safety
- [ ] More sophisticated validation
- [ ] Diff view between versions
- [ ] Streaming AI responses
- [ ] Component prop validation with Zod
- [ ] Better error messages
- [ ] MongoDB for persistence
- [ ] Authentication system

---

## 📹 Demo Video

https://youtu.be/SkdBbPvZnRA

Shows:
- Initial UI generation
- Iterative modifications
- Live preview updates
- Explainer output
- Rollback functionality

---

## 🏆 Assignment Requirements

✅ Multi-agent architecture  
✅ Deterministic components  
✅ Iterative editing support  
✅ Explainability  
✅ Safety validation  
✅ Rollback feature  
✅ Live preview  
✅ Code editing  

---

## 📧 Contact

**Developer:** Dhruv Gupta  
**Email:** dhruvgupta0506@gmail.com
**GitHub:** github.com/Dhruv-Gupta0506

---

Built for Ryze AI Full-Stack Assignment
