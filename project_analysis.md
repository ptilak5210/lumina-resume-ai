# 🔍 Lumina Resume AI — Full Project Analysis

## 📋 Project Overview
**Name:** Lumina Resume AI  
**Type:** AI-Powered Resume Builder & Analyzer  
**Architecture:** Full-Stack (React Frontend + Python Flask Backend)

---

## 🛠️ Technologies Used

### Frontend
| Technology | Version | Use |
|---|---|---|
| React | 19 | UI Framework |
| TypeScript | 5.8 | Type Safety |
| Vite | 6.2 | Build Tool + Dev Server |
| TailwindCSS | 4.2 | Styling |
| Axios | 1.13 | HTTP API Calls |
| Lucide React | 0.563 | Icons |
| jsPDF + autotable | 4.1 / 5.0 | PDF Download |
| Google Genai SDK | 1.41 | Gemini AI Features |
| Firebase | 12.9 | Google/GitHub Social Login |
| pdfjs-dist | 5.6 | ❌ NOW UNUSED (replaced by backend parser) |

### Backend
| Technology | Use |
|---|---|
| Python Flask | Web Framework |
| Flask-SQLAlchemy | Database ORM |
| Flask-JWT-Extended | Authentication Tokens |
| Flask-CORS | Cross-Origin Requests |
| pdfminer.six | PDF Text Extraction |
| SQLite (dev) / PostgreSQL (prod) | Database |
| python-docx | ❌ UNUSED — no .docx parsing done |
| openai | ❌ UNUSED — Gemini used instead |
| psycopg2-binary | PostgreSQL driver (unused in dev) |

---

## ✅ Features (What Works)

### Auth System
- [x] Email/Password Signup & Login
- [x] JWT Token-based authentication
- [x] Forgot Password (email reset link)
- [x] Reset Password via token
- [x] Google & GitHub Social Login (Firebase-based)

### Resume Builder
- [x] Step-by-step form (Personal Info → Experience → Education → Skills → Projects → Certifications)
- [x] Real-time preview panel
- [x] Multiple resume themes (Minimalist, Modern, Bold, Classic, Executive)
- [x] Download resume as JSON
- [x] Download resume as PDF (jsPDF)

### PDF Upload & Parse
- [x] Upload PDF resume
- [x] Backend (Python pdfminer.six) extracts text
- [x] Smart regex parser fills all 7 sections
- [x] Parsed data saved to database

### Resume Management
- [x] Save resumes to backend database (SQLite)
- [x] Load all resumes on login
- [x] Delete resumes from DB
- [x] "My Resumes" page — view and edit saved resumes

### AI Features (Gemini API)
- [x] Generate Professional Summary from resume data
- [x] Resume Strength Analysis (ATS score + suggestions)
- [x] Smart Section Suggestions (AI Refine button)
- [x] Quantification Suggestions for Experience
- [x] Full Audit Report generation

### Sample Resumes
- [x] 10 pre-built sample resume templates for different professions

---

## ❌ Problems Found

### 🔴 Critical Bugs

#### 1. JWT 422 Error on All Requests
```
GET /api/auth/me → 422 Unprocessable Entity
POST /api/resumes/parse → 422
```
**Cause:** Vite proxy doesn't reliably forward `Authorization` headers.  
**Status:** Partially fixed — manual header injection added.  
**Remaining Fix Needed:** Vite must be restarted after `vite.config.ts` change.

#### 2. `createdAt` field missing in Resume model
The `Resume.from_dict()` uses `createdAt` but at DB level it auto-generates.
No mismatch yet but could cause issues on frontend display.

#### 3. `pdfParser.ts` is DEAD CODE
`frontend/utils/pdfParser.ts` is no longer imported anywhere.  
It's still 12KB of code doing nothing. **Should be deleted.**

### 🟡 Warnings / Bad Practices

#### 4. `MOCK_SAVED_RESUMES` still in constants.tsx
The old mock "Senior Product Designer: Alex Rivera" resume is still defined.
It was the source of the original "demo data shown instead of real data" bug.
**Should be removed** — `savedResumes` now starts as `[]` from backend, but the constant still exists.

#### 5. `firebase` package installed but barely used
Firebase 12.9 is ~500KB added to bundle. Only used for Google/GitHub login buttons.
Social login tokens are passed to the Flask backend via `/api/auth/social-login`.
Firebase project credentials are hardcoded as `"YOUR_API_KEY"` placeholders — 
**social login is broken** without proper Firebase setup.

#### 6. `pdfjs-dist` still in `package.json`
5.6 MB library. Now unused since backend handles PDF parsing.  
**Should be removed:** `npm uninstall pdfjs-dist`

#### 7. `python-docx` and `openai` in `requirements.txt`
Neither is used. Wastes install time.

#### 8. `backend_check.py`, `verify_backend.py`, `verify_reset.py` in root
These are developer debug scripts, not part of the app.
**Should be removed or moved** to a `/scripts/` folder.

#### 9. `frontend/src/context/` folder is empty
`frontend/src/` only exists as an empty shell. All code lives in `frontend/` root.
**Should be deleted.**

#### 10. Spec docs in root (8 markdown files)
`ADMIN_SPECS.md`, `AUTH_SPECS.md`, `CORE_ENGINE_SPECS.md`, etc.
These are college project submission docs, clutter the root folder.
**Should be moved** to a `/docs/` folder.

#### 11. `SaveModal` not properly connected to backend
When user clicks "Save" in the editor, `isSaveModalOpen` opens a modal that asks for title,
but `onSave` in the modal just adds to `savedResumes` state — **does NOT call backend API**.
Resume builder saves to memory only, not DB.

#### 12. `score` field missing from Resume backend model response
Frontend `ResumeData` has optional `score` field, but when loading from DB it may
come back as `null` and cause display issues in `StatsCard`.

---

## 🗂️ Current File Structure

```
ai-powered-resume-analyzer-main/
├── backend/
│   ├── app/
│   │   ├── __init__.py              ✅ App factory
│   │   ├── models/
│   │   │   ├── __init__.py          ✅ (just created)
│   │   │   ├── user.py              ✅ User model
│   │   │   └── resume.py            ✅ Resume model (new)
│   │   ├── routes/
│   │   │   ├── auth.py              ✅ Auth endpoints
│   │   │   └── resume.py            ✅ Resume CRUD + parse (new)
│   │   ├── services/
│   │   │   └── pdf_parser.py        ✅ PDF extraction (new)
│   │   └── utils/
│   │       └── email_utils.py       ✅ Password reset emails
│   ├── config.py                    ✅
│   ├── run.py                       ✅
│   ├── requirements.txt             ⚠️ Has unused deps
│   ├── migrate_db.py                ⚠️ Dev script (move to /scripts)
│   ├── seed_admin.py                ⚠️ Dev script (move to /scripts)
│   ├── verify_backend.py            ❌ Debug script (delete or move)
│   └── verify_reset.py              ❌ Debug script (delete or move)
│
├── frontend/
│   ├── App.tsx                      ✅ Main app + routing
│   ├── types.ts                     ✅ TypeScript interfaces
│   ├── constants.tsx                ⚠️ MOCK_SAVED_RESUMES should be removed
│   ├── index.tsx                    ✅ React entry point
│   ├── index.html                   ✅
│   ├── index.css                    ✅
│   ├── vite.config.ts               ✅ (proxy fix applied)
│   ├── components/
│   │   ├── Auth.tsx                 ✅ Login/Signup modal
│   │   ├── ResumeBuilder.tsx        ✅ Main editor (37KB — large but okay)
│   │   ├── ResumePreview.tsx        ✅ Live preview panel
│   │   ├── MyResumes.tsx            ✅ Saved resumes list
│   │   ├── AiSuggestions.tsx        ✅ AI features panel
│   │   ├── TemplatesView.tsx        ✅ Sample templates
│   │   ├── Sidebar.tsx              ✅ Nav sidebar
│   │   ├── StrengthMeter.tsx        ✅ ATS score UI
│   │   ├── StatsCard.tsx            ✅ Dashboard stats
│   │   ├── SaveModal.tsx            ⚠️ Not wired to backend
│   │   ├── SamplesModal.tsx         ✅
│   │   ├── SettingsView.tsx         ✅ Profile settings
│   │   ├── ForgotPasswordPage.tsx   ✅
│   │   └── ResetPasswordPage.tsx    ✅
│   ├── services/
│   │   ├── api.ts                   ✅ Axios instance with JWT interceptor
│   │   ├── authService.ts           ✅ Auth API calls
│   │   ├── resumeService.ts         ✅ Resume CRUD API calls (new)
│   │   ├── geminiService.ts         ✅ AI features (cleaned)
│   │   └── firebase.ts             ⚠️ Placeholder keys — social login broken
│   ├── utils/
│   │   ├── pdfGenerator.ts          ✅ jsPDF resume download
│   │   └── pdfParser.ts             ❌ DEAD CODE — no longer imported
│   └── src/
│       └── context/                 ❌ Empty folder — should be deleted
│
├── docs/ (should be created)       ← Move all .md spec files here
├── ADMIN_SPECS.md                   ⚠️ Should be in /docs
├── AUTH_SPECS.md                    ⚠️ Should be in /docs
├── (6 more .md files)               ⚠️ Should be in /docs
├── backend_check.py                 ❌ Debug script in wrong place
├── tsc_errors.txt                   ❌ Temp file, should be deleted
└── package-lock.json (root)         ❌ Wrong place — npm not used in root
```

---

## 🔧 What Needs to Be Done (Priority Order)

### HIGH PRIORITY
1. **Restart Vite** — proxy config changes need restart
2. **Logout + Re-login** — get fresh JWT token  
3. **Fix SaveModal** — wire "Save Draft" button to `resumeService.create()`

### MEDIUM PRIORITY  
4. Remove `frontend/utils/pdfParser.ts` (dead code)
5. Remove `pdfjs-dist` from package.json: `npm uninstall pdfjs-dist`
6. Remove `python-docx` and `openai` from `requirements.txt`
7. Remove empty `frontend/src/` folder
8. Clean `MOCK_SAVED_RESUMES` from constants.tsx
9. Delete/move debug scripts (`verify_backend.py`, `verify_reset.py`, `backend_check.py`)

### LOW PRIORITY
10. Move 8 spec `.md` files to `/docs/` folder
11. Delete `tsc_errors.txt` and root `package-lock.json`
12. Fix Firebase config for real social login (add `.env` keys)
13. Connect resume score to `StatsCard` properly
