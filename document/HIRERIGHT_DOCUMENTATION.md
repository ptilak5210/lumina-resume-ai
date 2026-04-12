# 🚀 HireRight Platform — Complete Build Documentation
### India's AI-Powered Job Application Automation Platform
**Goal: 1,000 → 10,000 Users | Version 1.0 | April 2026**

---

## 📌 Table of Contents
1. [Platform Overview](#overview)
2. [Current Project Status](#current-status)
3. [What's NOT Done Yet](#not-done)
4. [Phase 2 — AI Automation Details](#phase-2)
5. [Complete Database Schema (Supabase)](#database)
6. [Step-by-Step Build Order](#build-order)
7. [Scaling to 1,000-10,000 Users](#scaling)
8. [Tech Stack Decisions](#tech-stack)

---

## 1. 📋 Platform Overview {#overview}

### What HireRight Does
```
User ka resume banata hai
        ↓
Best matching jobs dhundta hai (LinkedIn, Naukri, Indeed, Internshala)
        ↓
Har company ka scam check karta hai (Trust Score 0-100)
        ↓
Smart Slot System se spam rokta hai
        ↓
AI se resume tailor karta hai har job ke liye
        ↓
Automatically apply karta hai (24/7, user so raha ho tab bhi)
        ↓
Dashboard pe track karta hai — kitne apply hue, kahan se reply aaya
```

### Platform Ki 3 Unique Strengths
| # | Feature | Koi Competitor Nahi Karta |
|---|---|---|
| 1 | **Company Scam Detection** | MCA India + Glassdoor + News → auto block if scam |
| 2 | **Smart Slot System** | 1 opening = max 5 applications, no inbox spam |
| 3 | **India-First Platform** | Naukri + Internshala + LinkedIn + Indeed — sab ek saath |

---

## 2. ✅ Current Project Status (Kya Ban Gaya Hai) {#current-status}

**Project Name:** Lumina Resume AI → HireRight ka Foundation

### DONE ✅

#### Backend (Python Flask)
```
✅ User Registration + Login (JWT Auth)
✅ Forgot Password + Reset via Email
✅ Google/GitHub Social Login (Firebase)
✅ PDF Upload → Python pdfminer.six se text extract
✅ Smart Regex Parser → 6 sections fill karta hai automatically
✅ Resume CRUD API (Create, Read, Update, Delete)
✅ Resume save to Database
✅ CORS setup (Frontend ↔ Backend)
✅ Vite Proxy (localhost:3000 → localhost:5000)
```

#### Frontend (React + TypeScript)
```
✅ Login/Signup Modal
✅ Dashboard Page
✅ Resume Builder (6 sections + real-time preview)
✅ PDF Upload → Form Auto-Fill
✅ Multiple Themes (Minimalist, Modern, Bold, Classic, Executive)
✅ Save/Load/Delete Resumes
✅ Download as PDF (jsPDF)
✅ AI: Generate Summary (Gemini)
✅ AI: ATS Score Analysis (Gemini)
✅ AI: Section Suggestions (Gemini)
✅ AI: Full Audit Report (Gemini)
✅ My Resumes Page
✅ AI Suggestions Page
✅ Templates/Samples Page
✅ Settings Page
```

#### Database (SQLite → Moving to Supabase)
```
✅ users table
✅ resumes table (with JSONB sections)
```

---

## 3. ❌ Kya NAHI Bana Hai (What's NOT Done) {#not-done}

### HIGH PRIORITY — Abhi Banana Padega

#### 3.1 Supabase Migration ❌
```
Problem: Database abhi SQLite hai — local file mein save hota hai
         Agar server restart ho → data wipe ho sakta hai
         1000 users handle nahi kar sakta
         
Solution: Supabase (PostgreSQL Cloud) pe migrate karo
Steps:
  1. supabase.com → New Project (FREE)
  2. .env mein DATABASE_URL update karo
  3. Backend restart → tables auto-create
  4. Done!
```

#### 3.2 SaveModal Backend Connection ❌
```
Problem: "Save Draft" button form data localStorage mein save karta hai
         Backend DB se connect nahi hai
         
Fix: SaveModal.tsx → resumeService.create() call karo
     3 lines ka fix hai — mujhe batao karunga
```

#### 3.3 JWT 422 Error — Vite Dev Server ❌
```
Problem: Vite proxy kabhi kabhi Authorization header strip karta hai
         Result: 422 error on file upload

Fix Status: Mostly fixed — Vite restart + re-login chahiye
Action: Frontend dev server restart karo → logout → login → try
```

---

## 4. 🤖 Phase 2 — AI Automation Details {#phase-2}

### 4.1 Job Scraping Engine
**Kya hai:** Background service jo har 2-3 ghante mein LinkedIn, Naukri, Indeed, Internshala pe nayi jobs dhundta hai.

**Technology: Python + httpx + BeautifulSoup / Playwright**

```
Architecture:
┌─────────────────────────────────────────────────┐
│              Job Scraper Service                 │
├─────────────────────────────────────────────────┤
│  Schedule: Celery Beat (har 2 ghante)            │
│                                                  │
│  For each platform:                              │
│   Naukri API → jobs list fetch                  │
│   Indeed Scraper → Playwright headless         │
│   LinkedIn → httpx + JSON API                  │
│   Internshala → API/Scraper                    │
│                                                  │
│  For each job found:                            │
│   1. Company name extract                       │
│   2. Check if already in jobs_cache DB         │
│   3. If new → Trust Score calculate            │
│   4. Save to jobs_cache table                  │
└─────────────────────────────────────────────────┘
```

**Kaise implement karein:**
```python
# backend/app/services/job_scraper.py

import httpx
from playwright.async_api import async_playwright

class NaukriScraper:
    BASE_URL = "https://www.naukri.com/jobapi/v3/search"
    
    async def search_jobs(self, role: str, location: str) -> list:
        params = {
            "noOfResults": 20,
            "urlType": "search_by_key_loc",
            "keyword": role,
            "location": location,
        }
        async with httpx.AsyncClient() as client:
            resp = await client.get(self.BASE_URL, params=params)
            jobs = resp.json().get("jobDetails", [])
            return [self._parse_job(j) for j in jobs]
    
    def _parse_job(self, raw: dict) -> dict:
        return {
            "platform": "naukri",
            "job_id_external": raw.get("jobId"),
            "title": raw.get("title"),
            "company_name": raw.get("companyName"),
            "location": raw.get("placeholders", [{}])[0].get("label", ""),
            "description": raw.get("jobDescription", ""),
            "openings": raw.get("vacancy", 1),
            "apply_url": f"https://www.naukri.com/{raw.get('staticUrl')}",
        }
```

---

### 4.2 Company Trust Score Engine

**Kya hai:** Har nayi company ke liye automatically 5 sources check karta hai aur 0-100 score deta hai.

```
Company Name Input
        ↓
┌─────────────────────────────────────────────────┐
│           Trust Score Calculator                 │
├─────────────────────────────────────────────────┤
│                                                  │
│  CHECK 1: MCA India API (25 points)             │
│  URL: https://efiling.mca.gov.in/                │
│  → Company registered hai? CIN valid?           │
│  → Kitne saal purani? (2+ years = full points)  │
│                                                  │
│  CHECK 2: Glassdoor Rating (20 points)          │
│  → httpx se Glassdoor search                    │
│  → Rating 4.0+ = 20pts, 3+ = 10pts, <3 = 0pts  │
│                                                  │
│  CHECK 3: Company Age / WHOIS (15 points)       │
│  → Domain WHOIS API se creation date           │
│  → 2+ years old = 15pts                        │
│                                                  │
│  CHECK 4: Office Address (15 points)            │
│  → Google Places API / Maps                    │
│  → Physical address verify                     │
│                                                  │
│  CHECK 5: Scam News (15 points)                 │
│  → Google News API: "company_name fraud scam"  │
│  → Results hai? = 0 points, blocking           │
│                                                  │
│  CHECK 6: Domain Age via WHOIS (10 points)      │
│  → New domain (< 6 months) = red flag          │
│                                                  │
│  Total = SUM → Save to companies table          │
└─────────────────────────────────────────────────┘
        ↓
Score: 0-49 🔴 Block | 50-79 🟡 Warn | 80-100 🟢 Auto Apply
```

**Code example:**
```python
# backend/app/services/trust_score.py

import httpx
import re
from datetime import datetime

class TrustScoreCalculator:
    
    async def calculate(self, company_name: str, domain: str = None) -> dict:
        scores = {}
        
        # Check 1: MCA Registration
        mca_result = await self._check_mca(company_name)
        scores['mca'] = mca_result  # max 25
        
        # Check 2: Glassdoor
        gd_result = await self._check_glassdoor(company_name)
        scores['glassdoor'] = gd_result  # max 20
        
        # Check 3-4: Age + Address
        scores['age'] = await self._check_company_age(company_name)  # max 15
        scores['address'] = 10  # Default with manual verification  # max 15
        
        # Check 5: Scam News
        scam_result = await self._check_scam_news(company_name)
        scores['news'] = scam_result  # max 15
        
        # Check 6: Domain Age
        if domain:
            scores['domain'] = await self._check_domain_age(domain)  # max 10
        
        total = sum(scores.values())
        return {
            "total": total,
            "breakdown": scores,
            "verdict": "safe" if total >= 80 else "warning" if total >= 50 else "blocked"
        }
    
    async def _check_scam_news(self, company_name: str) -> int:
        """Google News API se scam news check karo"""
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                "https://newsapi.org/v2/everything",
                params={
                    "q": f"{company_name} scam fraud fake cheating",
                    "language": "en",
                    "pageSize": 5,
                    "apiKey": "YOUR_NEWS_API_KEY"
                }
            )
            articles = resp.json().get("articles", [])
            return 0 if len(articles) > 2 else 15
```

---

### 4.3 Smart Slot System

**Kya hai:** Har job ki openings count ke basis pe maximum applications define karo. Sirf best match users ko slot milega.

```
RULE: max_slots = job_openings × 5
Example: Job has 2 openings → max 10 people can apply

Algorithm:
FOR each new job found:
  max_slots = openings * 5
  
  GET all users WHERE auto_apply = TRUE
  FOR each user:
    match_score = calculate_match(user.resume, job.description)
  
  SORT users by match_score DESC
  TOP N users (N = max_slots) → apply karo
  REMAINING users → notify: "Better match found, slot full"
```

**Match Score Formula:**
```python
def calculate_match_score(resume: dict, job: dict) -> int:
    score = 0
    
    # 35% — Skills match
    resume_skills = set(s.lower() for s in resume['skills'])
    job_skills = extract_skills_from_jd(job['description'])
    skill_overlap = len(resume_skills & job_skills) / max(len(job_skills), 1)
    score += int(skill_overlap * 35)
    
    # 25% — Experience level
    resume_exp_years = calculate_experience_years(resume['experience'])
    job_exp_required = extract_experience_from_jd(job['description'])
    if abs(resume_exp_years - job_exp_required) <= 1:
        score += 25
    elif abs(resume_exp_years - job_exp_required) <= 2:
        score += 15
    
    # 20% — Location match
    if any(loc.lower() in job['location'].lower() 
           for loc in user_prefs['locations']):
        score += 20
    
    # 15% — Salary range
    if (user_prefs['salary_min'] <= job['salary_max'] and 
        user_prefs['salary_max'] >= job['salary_min']):
        score += 15
    
    # 5% — Resume quality (ATS score)
    score += int((resume.get('score', 50) / 100) * 5)
    
    return min(score, 100)
```

---

### 4.4 Auto-Apply Engine (Playwright)

**Kya hai:** Browser automation jo automatically form fill karta hai aur submit karta hai.

```
Apply Flow:
User ka resume (AI tailored) + job URL
        ↓
Playwright browser open (headless = invisible)
        ↓
Platform detect karo (Naukri / LinkedIn / Indeed)
        ↓
Platform-specific apply function call karo
        ↓
Form fill → Resume attach → Submit
        ↓
Confirmation page detect karo
        ↓
application_status = 'applied' → DB mein save
        ↓
User ko notification bhejo
```

**Code Structure:**
```python
# backend/app/services/auto_apply/

auto_apply/
├── __init__.py
├── base_applier.py      ← Common browser methods
├── naukri_applier.py    ← Naukri-specific apply flow
├── linkedin_applier.py  ← LinkedIn Easy Apply flow
├── indeed_applier.py    ← Indeed Quick Apply flow
└── internshala_applier.py

# base_applier.py
from playwright.async_api import async_playwright, Page

class BaseApplier:
    async def __aenter__(self):
        self.p = await async_playwright().start()
        self.browser = await self.p.chromium.launch(headless=True)
        self.page = await self.browser.new_page()
        # Set realistic user agent
        await self.page.set_extra_http_headers({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
        })
        return self
    
    async def fill_form(self, selectors: dict, values: dict):
        for field, selector in selectors.items():
            if field in values:
                await self.page.fill(selector, values[field])
    
    async def __aexit__(self, *args):
        await self.browser.close()
        await self.p.stop()

# naukri_applier.py
class NaukriApplier(BaseApplier):
    async def apply(self, apply_url: str, resume_data: dict) -> bool:
        await self.page.goto(apply_url)
        await self.page.wait_for_load_state("networkidle")
        
        # Click Apply button
        apply_btn = self.page.locator('[class*="apply-button"]')
        await apply_btn.click()
        
        # Fill application form
        await self.fill_form({
            "name": 'input[name="applicantName"]',
            "email": 'input[name="email"]',
            "phone": 'input[name="mobile"]',
        }, {
            "name": resume_data["fullName"],
            "email": resume_data["email"],
            "phone": resume_data["phone"],
        })
        
        # Submit
        await self.page.click('button[type="submit"]')
        await self.page.wait_for_timeout(2000)
        
        # Check success
        success = await self.page.is_visible('[class*="success"]')
        return success
```

---

### 4.5 Background Task System (24/7)

**Kya hai:** Cloud pe chalne wala system jo raat ko bhi kaam karta hai.

```
Technology: Celery + Redis

Architecture:
┌─────────────────────────────────────────────────┐
│                 Celery Beat                      │
│            (Task Scheduler)                      │
├─────────────────────────────────────────────────┤
│  Every 2 hours:     scrape_new_jobs()            │
│  Every 30 mins:     process_auto_apply_queue()   │
│  Every 6 hours:     update_trust_scores()        │
│  Every day:         send_daily_digest_emails()   │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│               Celery Workers                     │
│          (Actual task execution)                 │
├─────────────────────────────────────────────────┤
│  Worker 1: Job scraping                          │
│  Worker 2: Trust score calculation               │
│  Worker 3: Auto-apply (Playwright)               │
│  Worker 4: AI resume tailoring (Gemini)          │
└─────────────────────────────────────────────────┘
                    ↓
             Redis (Message Queue)
```

---

## 5. 🗄️ Complete Database Schema (Supabase) {#database}

### ⚠️ Sabse Important — Yeh 8 Tables Banana Padega

---

### Table 1: `users` ✅ Already Exists
```sql
-- Supabase mein run karo (SQL Editor)
CREATE TABLE IF NOT EXISTS users (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(100) NOT NULL,
  email           VARCHAR(120) UNIQUE NOT NULL,
  password_hash   VARCHAR(256),
  role            VARCHAR(20) DEFAULT 'user',
  plan            VARCHAR(20) DEFAULT 'free',  -- free, pro, premium
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  reset_token     VARCHAR(100),
  reset_token_expiry TIMESTAMPTZ
);
```

---

### Table 2: `resumes` ✅ Already Exists
```sql
CREATE TABLE IF NOT EXISTS resumes (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title           VARCHAR(200),
  full_name       VARCHAR(100) DEFAULT '',
  email           VARCHAR(120) DEFAULT '',
  phone           VARCHAR(30) DEFAULT '',
  location        VARCHAR(100) DEFAULT '',
  linkedin        VARCHAR(200) DEFAULT '',
  website         VARCHAR(200) DEFAULT '',
  summary         TEXT DEFAULT '',
  theme           VARCHAR(50) DEFAULT 'minimalist',
  score           INTEGER,
  experience      TEXT DEFAULT '[]',   -- JSON stored as TEXT
  education       TEXT DEFAULT '[]',
  skills          TEXT DEFAULT '[]',
  projects        TEXT DEFAULT '[]',
  certifications  TEXT DEFAULT '[]',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table 3: `user_preferences` ❌ Banana Padega (Phase 2)
```sql
-- User ki job search preferences
CREATE TABLE user_preferences (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  
  -- Job targeting
  job_roles       TEXT[] DEFAULT '{}',      -- ['React Developer', 'Full Stack']
  locations       TEXT[] DEFAULT '{}',      -- ['Mumbai', 'Remote', 'Pune']
  salary_min      INTEGER DEFAULT 500000,   -- ₹5 LPA in paise/yearly
  salary_max      INTEGER DEFAULT 2000000,  -- ₹20 LPA
  experience_min  INTEGER DEFAULT 0,        -- years
  experience_max  INTEGER DEFAULT 10,
  job_type        TEXT[] DEFAULT '{}',      -- ['Full Time', 'Remote', 'Hybrid']
  
  -- Platform selection
  platforms       TEXT[] DEFAULT '{"naukri","linkedin","indeed"}',
  
  -- Auto-apply settings
  auto_apply_on   BOOLEAN DEFAULT false,    -- ON/OFF switch
  daily_limit     INTEGER DEFAULT 20,       -- Max applications per day
  trust_min_score INTEGER DEFAULT 70,       -- Minimum trust score to apply
  
  -- Active resume
  active_resume_id INTEGER REFERENCES resumes(id),
  
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Table 4: `companies` ❌ Banana Padega (Phase 2)
```sql
-- Company trust scores ka cache
CREATE TABLE companies (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(200) NOT NULL,
  name_normalized VARCHAR(200),             -- lowercase, no spaces (for searching)
  domain          VARCHAR(200),
  
  -- Trust Score breakdown
  trust_score     INTEGER DEFAULT 0,        -- 0-100
  mca_registered  BOOLEAN,
  mca_cin         VARCHAR(50),
  company_age_years INTEGER,
  glassdoor_rating DECIMAL(3,1),
  glassdoor_reviews INTEGER DEFAULT 0,
  ambitionbox_rating DECIMAL(3,1),
  has_scam_news   BOOLEAN DEFAULT false,
  scam_news_count INTEGER DEFAULT 0,
  is_flagged      BOOLEAN DEFAULT false,    -- manually flagged by team
  domain_age_months INTEGER,
  
  -- Verdict
  verdict         VARCHAR(20),              -- 'safe', 'warning', 'blocked'
  
  -- Metadata
  last_checked    TIMESTAMPTZ,
  check_count     INTEGER DEFAULT 1,        -- kitni baar check hua
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_companies_name ON companies(name_normalized);
```

---

### Table 5: `jobs_cache` ❌ Banana Padega (Phase 2)
```sql
-- Platforms se scraped jobs ka cache
CREATE TABLE jobs_cache (
  id              SERIAL PRIMARY KEY,
  
  -- Platform info
  platform        VARCHAR(50) NOT NULL,     -- 'naukri', 'linkedin', 'indeed', 'internshala'
  job_id_external VARCHAR(200),             -- Platform's own job ID
  
  -- Job details
  title           VARCHAR(200) NOT NULL,
  company_name    VARCHAR(200),
  company_id      INTEGER REFERENCES companies(id),
  location        VARCHAR(200),
  salary_min      INTEGER,                  -- Annual in rupees
  salary_max      INTEGER,
  experience_min  INTEGER,                  -- Years
  experience_max  INTEGER,
  job_type        VARCHAR(50),              -- full_time, remote, hybrid
  description     TEXT,
  skills_required TEXT[] DEFAULT '{}',     -- Extracted from description
  
  -- Smart Slot System
  openings        INTEGER DEFAULT 1,
  max_slots       INTEGER,                  -- openings × 5
  slots_filled    INTEGER DEFAULT 0,
  
  -- Trust & Quality
  trust_score     INTEGER,                  -- Copied from companies table
  
  -- URLs
  apply_url       TEXT,
  job_url         TEXT,
  
  -- Timestamps
  posted_at       TIMESTAMPTZ,
  expires_at      TIMESTAMPTZ,
  scraped_at      TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicates
  UNIQUE(platform, job_id_external)
);

CREATE INDEX idx_jobs_cache_platform ON jobs_cache(platform);
CREATE INDEX idx_jobs_cache_trust ON jobs_cache(trust_score);
```

---

### Table 6: `job_applications` ❌ Banana Padega (Phase 2)
```sql
-- User ke saare applications ka record
CREATE TABLE job_applications (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
  resume_id       INTEGER REFERENCES resumes(id),
  job_id          INTEGER REFERENCES jobs_cache(id),
  
  -- Job snapshot (in case job_cache changes)
  platform        VARCHAR(50),
  company_name    VARCHAR(200),
  job_title       VARCHAR(200),
  apply_url       TEXT,
  
  -- AI matching
  match_score     INTEGER,                  -- 0-100, how good a fit
  
  -- Application content
  tailored_resume TEXT,                     -- JSON — AI-modified resume
  cover_letter    TEXT,                     -- AI-generated
  
  -- Status tracking
  status          VARCHAR(50) DEFAULT 'applied',
  -- Values: applied → viewed → shortlisted → interview → offer → rejected
  
  -- Metadata
  applied_at      TIMESTAMPTZ DEFAULT NOW(),
  status_updated_at TIMESTAMPTZ DEFAULT NOW(),
  notes           TEXT,
  is_auto_applied BOOLEAN DEFAULT true
);

CREATE INDEX idx_applications_user ON job_applications(user_id);
CREATE INDEX idx_applications_status ON job_applications(status);
```

---

### Table 7: `user_daily_stats` ❌ Banana Padega (Phase 2)
```sql
-- Dashboard ke liye daily application stats
CREATE TABLE user_daily_stats (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date            DATE NOT NULL,
  
  -- Platform counts
  linkedin_applied  INTEGER DEFAULT 0,
  naukri_applied    INTEGER DEFAULT 0,
  indeed_applied    INTEGER DEFAULT 0,
  internshala_applied INTEGER DEFAULT 0,
  total_applied     INTEGER DEFAULT 0,
  
  -- Results
  viewed          INTEGER DEFAULT 0,
  shortlisted     INTEGER DEFAULT 0,
  rejected        INTEGER DEFAULT 0,
  
  UNIQUE(user_id, date)
);
```

---

### Table 8: `notifications` ❌ Banana Padega (Phase 2)
```sql
-- User notifications (email + in-app)
CREATE TABLE notifications (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type            VARCHAR(50),  -- 'applied', 'interview', 'slot_full', 'scam_blocked'
  title           VARCHAR(200),
  message         TEXT,
  job_id          INTEGER REFERENCES jobs_cache(id),
  application_id  INTEGER REFERENCES job_applications(id),
  is_read         BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 6. 🗺️ Step-by-Step Build Order {#build-order}

### 🔴 STEP 1 — Supabase Setup (Karo ABHI — 30 min)
```
1. supabase.com → Sign Up (Free)
2. New Project → Name: "hireright-db"
3. Dashboard → Settings → Database
4. Copy "Connection String" (URI format)
5. backend/.env mein replace karo:
   DATABASE_URL=postgresql://postgres:YOUR_PASS@db.xxxx.supabase.co:5432/postgres
6. Backend restart karo → Tables auto-create
7. TEST: Signup karo app mein → Supabase Dashboard pe Users table mein check karo
```

---

### 🔴 STEP 2 — Fix Current Bugs (1-2 din)

#### Bug 1: SaveModal Backend Connect ❌
```
File: frontend/components/SaveModal.tsx
Problem: Save button sirf state update karta hai, backend nahi
Fix: SaveModal onSave mein resumeService.create() call karo
```

#### Bug 2: JWT 422 Fix ❌
```
Action: 
1. Vite dev server band karo (Ctrl+C)
2. cd frontend && npm run dev (restart)
3. Browser: Logout karo
4. Login karo (fresh token)
5. PDF upload try karo
```

#### Bug 3: Frontend pdfParser.ts open in editor ❌
```
File: frontend/utils/pdfParser.ts
Status: Already deleted — bas editor tab band karo
```

---

### 🟡 STEP 3 — Phase 2 Foundation (1 hafte)

#### 3A. Job Preferences UI
```
File: frontend/components/PreferencesView.tsx (NEW)
Fields:
  - Job roles (multi-select tags)
  - Locations (Mumbai, Pune, Delhi, Remote, etc.)
  - Salary range slider (₹3L to ₹50L)
  - Experience (0-1, 1-3, 3-5, 5+ years)
  - Platforms (LinkedIn ☑ Naukri ☑ Indeed ☑)
  - Auto-Apply toggle (ON/OFF)
  - Daily Limit (10/20/50/100)
  - Min Trust Score slider (50-90)
```

#### 3B. Backend: Preferences API
```
POST /api/preferences/   → Save user preferences
GET  /api/preferences/   → Get user preferences
```

#### 3C. Create Supabase Tables
```sql
-- Supabase SQL Editor mein run karo:
-- (Tables 3-8 jo upar define kiye hain)
```

---

### 🟡 STEP 4 — Job Scraping (1 hafte)

```
1. Naukri scraper banao (httpx + JSON API)
   File: backend/app/services/scrapers/naukri_scraper.py

2. Indeed scraper (Playwright)
   File: backend/app/services/scrapers/indeed_scraper.py

3. Scraper integration
   File: backend/app/tasks/scrape_jobs.py (Celery task)

4. Test: 10 jobs scrape karo → jobs_cache table mein dekho
```

---

### 🟡 STEP 5 — Trust Score (1 hafte)

```
1. Trust score calculator banao
   File: backend/app/services/trust_score.py

2. Companies table populate karo test data se

3. API endpoint
   GET /api/company/score?name=Infosys

4. Frontend mein show karo on Job card
```

---

### 🟢 STEP 6 — Auto-Apply Engine (2 hafte)

```
1. Playwright install karo:
   pip install playwright
   playwright install chromium

2. Naukri applier banao + test manually

3. LinkedIn Easy Apply banao + test

4. Celery setup:
   pip install celery redis
   
5. Background tasks setup + test

6. Test: 1 real application bhejo (manually verify)
```

---

### 🟢 STEP 7 — Dashboard & Notifications (1 hafte)

```
1. Application tracker UI
   - Table: Platform | Company | Status | Date
   - Stats: Total Applied | Interview | Rejected

2. Notification system
   - In-app: Bell icon mein dikhao
   - Email: "5 jobs pe apply ho gaya aaj!"

3. Company Trust Score display
   - Job card pe green/yellow/red badge
```

---

## 7. 📈 Scaling to 1,000 → 10,000 Users {#scaling}

### User Tiers

| Users | Setup | Cost/Month |
|---|---|---|
| 0–100 | Current Flask + SQLite | FREE |
| 100–1,000 | Flask + Supabase + Railway | ~₹1,500 |
| 1,000–5,000 | Flask + Supabase + Celery + Redis | ~₹5,000 |
| 5,000–10,000 | Gunicorn + Load Balancer + AWS | ~₹15,000 |

### Supabase Free Tier Limits
```
Database:  500MB storage (enough for ~5,000 resumes)
Auth:      50,000 users
Bandwidth: 5GB/month
API:       unlimited requests
```

### When to Upgrade
```
500+ users → Supabase Pro ($25/month)
1000+ users → Add Redis (Railway: $5/month)
2000+ users → Celery workers × 2
5000+ users → AWS EC2 + RDS PostgreSQL
```

### Performance Optimizations
```python
# 1. Database indexes add karo (Supabase SQL Editor)
CREATE INDEX idx_jobs_skills ON jobs_cache USING GIN(skills_required);
CREATE INDEX idx_apps_user_date ON job_applications(user_id, applied_at DESC);

# 2. Caching (Redis)
@cache.cached(timeout=3600, key_prefix='trust_score_%s')
def get_trust_score(company_name: str) -> dict:
    # Calculate once, cache 1 hour
    ...

# 3. Rate limiting (prevent 1 user 1000 API calls)
from flask_limiter import Limiter
limiter = Limiter(app, default_limits=["200 per day", "50 per hour"])
```

---

## 8. 🛠️ Tech Stack Decision Summary {#tech-stack}

### Current Stack (Keep It)
```
Frontend:  React 19 + TypeScript + Vite + TailwindCSS  ✅
Backend:   Python Flask                                 ✅
Auth:      JWT (Flask-JWT-Extended)                     ✅
AI:        Google Gemini API                            ✅
PDF Parse: pdfminer.six (Backend)                       ✅
PDF Build: jsPDF (Frontend)                             ✅
```

### Add for Phase 2
```
Database:       Supabase (PostgreSQL) ← MIGRATE ABHI
Job Automation: Playwright (Python)
Background:     Celery + Redis
Job APIs:       Naukri API + httpx scrapers
Trust Score:    NewsAPI + WHOIS API + Glassdoor scraping
Hosting (Free): Railway.app (backend) + Vercel (frontend)
Notifications:  Firebase Cloud Messaging / Email
```

### Don't Use (Avoid)
```
❌ MongoDB  → Supabase PostgreSQL better hai (joins, transactions)
❌ Node.js backend → Python already hai, stay consistent
❌ Selenium → Playwright faster + better hai
❌ AWS Day 1 → Railway.app se start karo, AWS baad mein
❌ React Native → PWA se start karo, native app baad mein
```

---

## 📅 Timeline Summary

| Week | Goal | Outcome |
|---|---|---|
| **Week 1** | Supabase setup + Bug fixes | App fully working, data saved in cloud |
| **Week 2** | Job Preferences UI + API | User can set what jobs they want |
| **Week 3** | Naukri job scraping | 100s of jobs in DB every day |
| **Week 4** | Trust Score engine | Company verified before apply |
| **Week 5** | Smart Slot system | No spam, best match gets slot |
| **Week 6** | Naukri auto-apply (Playwright) | First actual automated application! |
| **Week 7-8** | Dashboard + Notifications | User can see all applications |
| **Week 9** | LinkedIn Easy Apply | Second platform live |
| **Week 10** | Beta launch | First 100 real users |
| **Month 3** | All platforms + 1000 users | Revenue starts |

---

## 🚨 Critical Things to Do This Week

```
DAY 1:  Supabase account banao → DATABASE_URL update karo → backend restart
DAY 2:  Logout + Re-login karo → PDF upload test karo → verify it works
DAY 3:  SaveModal fix karo → backend se connect karo
DAY 4:  Job Preferences table Supabase mein create karo
DAY 5:  PreferencesView.tsx UI banao
```

---

*HireRight Platform Documentation v2.0*  
*Goal: India's #1 Safe Job Application Platform*  
*Target: 10,000 users in 12 months*
