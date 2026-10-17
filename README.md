# Borno Higher Study — Platform Documentation

**Tagline:** *Your Future. Your University. Your World.*

Borno Higher Study is an international higher-education discovery platform designed to help students discover universities, compare degree programs, calculate living expenses and tuition in Bangladeshi Taka (BDT), discover verified scholarships, validate English proficiency requirements, and consult an AI Study Abroad Advisor.

---

## 🏛️ Key Features

1. **30 International Study Destinations Directory**
   - Detailed coverage of Finland, Netherlands, Germany, UK, USA, Canada, Australia, New Zealand, Sweden, Norway, Denmark, Switzerland, France, Italy, Spain, Portugal, Ireland, Austria, Belgium, Poland, Czechia, Hungary, Estonia, Latvia, Lithuania, Japan, South Korea, China, Singapore, and Malaysia.
   - Comprehensive living costs in local currency & converted into BDT.
   - Official immigration and student visa portals (`migri.fi`, `ind.nl`, `make-it-in-germany.com`, etc.).
   - Post-study work visa rights (e.g. 2-year Finnish permit, 18-month German job seeker visa).

2. **Verified University & Course Catalog**
   - Comprehensive academic disciplines (Computer Science, Software Engineering, IT, AI, Machine Learning, Data Science, Cybersecurity, Cloud/DevOps, Engineering, and Business).
   - Real tuition figures, application deadlines, prerequisites, and direct links to official course modules.

3. **Interactive Tuition & Cost Calculator**
   - Select destination country, university, degree, and study duration.
   - Converts tuition and living costs into Bangladeshi Taka (BDT) in real time.
   - Deducts eligible verified scholarship waivers.
   - Transparently separates verified institutional tuition from estimated living expenses.

4. **IELTS, TOEFL, and PTE Eligibility Checker**
   - Evaluates overall scores and individual reading, listening, writing, and speaking bands against verified program prerequisites.
   - Identifies exact unmet subscore reasons with official admissions links.

5. **Borno Study Advisor (Grounded AI Agent)**
   - RAG architecture over verified university and scholarship records.
   - Citations to official portals for every recommendation.
   - Deterministic search and filtering fallback if external LLM providers are unavailable.

6. **Scholarship Discovery Engine**
   - Government scholarships, merit awards, tuition waivers, and fully funded fellowships.
   - Explicitly tagged for Bangladeshi student eligibility (e.g., Hungarian Stipendium Hungaricum, DAAD EPOS, Chevening, Swedish Institute SISGP, MEXT).

7. **Admin Dashboard & Data Ingestion Pipeline**
   - Review and update verification statuses.
   - Pre-flight CSV duplicate detection and import preview.
   - Data freshness tracking and audit logs.

---

## 🚀 Quick Start (Development Mode)

Both the Node.js Express server and Vite React client can be run with:

```bash
# 1. Install root, client, and server dependencies
npm install
cd client && npm install
cd ../server && npm install
cd ..

# 2. Run both Client and Server concurrently
npm run dev
```

- **Frontend Application:** [http://localhost:5173](http://localhost:5173)
- **API Server:** [http://localhost:5001](http://localhost:5001)
- **API Health Check:** [http://localhost:5001/api/health](http://localhost:5001/api/health)

---

## 🐳 Docker Production Setup

To run the complete production stack (PostgreSQL with pgvector, Express API, and Nginx React SPA):

```bash
docker-compose up --build -d
```

- Client: `http://localhost`
- API Server: `http://localhost:5001/api`
- PostgreSQL Database: `localhost:5432` (`borno_study_db`)

---

## 🔑 Demo Credentials

To test user and administrative roles instantly:

| Role | Email | Password |
|---|---|---|
| **Super Admin** | `admin@borno.edu` | `BornoAdmin2025!` |
| **Student** | `student@borno.edu` | `Student2025!` |

*(One-click demo buttons are available on the `/auth` page)*
