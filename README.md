# InterviewAI — AI Interview Preparation
 
Upload a job description and your resume (or a quick self-description), and InterviewAI generates a tailored interview prep plan: technical & behavioral questions with model answers, a resume-to-job match score, skill-gap analysis, and a day-by-day preparation roadmap.
 
A MERN-style app — Express/MongoDB API on the backend, a Vite + React 19 SPA on the frontend, powered by Google's Gemini API for report generation.
 
## ✨ What's new in this update
 
The auth screens (Login / Register) were the roughest part of the UI — plain, unbranded forms with no visual connection to the rest of the app. This pass:
 
- Redesigned **Login** and **Register** as a split-panel layout (branding panel + form panel) matching the dark theme already used on the Home and Interview report pages.
- Added icon-prefixed inputs, a show/hide password toggle, inline error messaging, and a loading state on the submit button.
- Unified the color palette into shared design tokens (`src/style.scss`) so every page (Home, Interview, Login, Register) now pulls from the same background, accent, and text colors instead of three slightly different palettes.
- Refreshed the shared `.primary-button` style (gradient, hover/disabled states) used across the whole app.
Home and the Interview report page already used a solid dark UI — those were left as-is aside from the shared token cleanup.
 
## 🧱 Tech stack
 
**Frontend** — React 19, React Router 7, Vite, Sass, Axios
**Backend** — Node.js, Express 5, MongoDB (Mongoose), JWT auth, Multer (resume upload), PDF parsing, Puppeteer (PDF generation), Google Gemini (`@google/genai`), Zod
 
## 📁 Project structure
 
```
AI-Interview-Preparation/
├── Backend/
│   └── src/
│       ├── controllers/   # auth + interview report logic
│       ├── middlewares/   # JWT auth guard, file upload
│       ├── models/        # User, InterviewReport, TokenBlacklist
│       ├── routes/        # /api/auth, /api/interview
│       ├── services/      # Gemini AI integration
│       └── app.js
└── Frontend/
    └── src/
        ├── features/
        │   ├── auth/       # Login, Register, auth context/hooks
        │   └── interview/  # Home (report generator), Interview (report viewer)
        ├── style.scss      # global theme tokens
        └── app.routes.jsx
```
 
## 🚀 Getting started
 
### Prerequisites
- Node.js 18+
- A MongoDB connection string (local or Atlas)
- A Google Gemini API key
### 1. Backend
 
```bash
cd Backend
npm install
```
 
Create a `.env` file in `Backend/`:
 
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```
 
```bash
npm run dev   # runs on http://localhost:3000
```
 
### 2. Frontend
 
```bash
cd Frontend
npm install
npm run dev   # runs on http://localhost:5173
```
 
The frontend expects the API at `http://localhost:3000` (see `src/features/auth/services/auth.api.js`).
 
## 🔌 API overview
 
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/logout` | Log out |
| GET | `/api/auth/getme` | Get the current user (protected) |
| POST | `/api/interview` | Generate a new interview report from a job description + resume/self-description (protected) |
| GET | `/api/interview` | List the current user's interview reports (protected) |
| GET | `/api/interview/report/:interviewId` | Get a single interview report (protected) |
| POST | `/api/interview/resume/pdf/:interviewReportId` | Generate/download a tailored resume PDF (protected) |
 
## 🎨 Design tokens
 
Shared across pages via `Frontend/src/style.scss` and mirrored as Sass variables in each feature stylesheet:
 
| Token | Value | Use |
|---|---|---|
| `--bg-page` | `#0d1117` | Page background |
| `--bg-card` | `#161b22` | Card / panel background |
| `--bg-input` | `#1e2535` | Input fields |
| `--border-color` | `#2a3348` | Borders / dividers |
| `--text-primary` | `#e6edf3` | Primary text |
| `--text-muted` | `#7d8590` | Secondary text |
| `--accent` | `#ff2d78` | Primary accent (buttons, highlights) |
| `--accent-alt` | `#ff6b9d` | Accent gradients / links |
 
## 📝 Notes / known issues
 
- `src/main.jsx` and `src/App.jsx` both wrap the tree in `AuthProvider` — harmless (the inner provider just takes precedence) but redundant, worth cleaning up.
- Login/Register currently show a generic error message on failure since `useAuth`'s `handleLogin`/`handleRegister` swallow the underlying API error rather than re-throwing it with a message. Surfacing the real server message (e.g. "email already in use") would need a small tweak to `useAuth.js`.
 
