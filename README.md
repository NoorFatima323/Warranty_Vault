<div align="center">

# 🛡️ WARRANTYVAULT™
### Autonomous Consumer Electronics Warranty Tracker & Statutory RMA Claim Engine
**Built for the Learn AI Basics Hackathon (Devpost)**

[![Status](https://img.shields.io/badge/Status-Fully%20Operational-10B981?style=for-the-badge)](https://noorfatima323.github.io/Warranty_Vault/)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-WarrantyVault-6366F1?style=for-the-badge&logo=github)](https://noorfatima323.github.io/Warranty_Vault/)
[![License](https://img.shields.io/badge/License-MIT-38BDF8?style=for-the-badge)](LICENSE)
[![Devpost](https://img.shields.io/badge/Devpost-Submission%20Ready-003E54?style=for-the-badge&logo=devpost)](devpost/checklist.md)

[**Live Web App**](https://noorfatima323.github.io/Warranty_Vault/) • [**Interactive Screens Hub**](https://noorfatima323.github.io/Warranty_Vault/screens_hub.html) • [**Launch Hardware Vault**](https://noorfatima323.github.io/Warranty_Vault/vault.html) • [**1-Click Judge Pass**](https://noorfatima323.github.io/Warranty_Vault/login.html)

</div>

---

## 🎯 Executive Summary & The Problem

Consumers and technical professionals invest thousands of dollars into premium electronics (MacBooks, studio displays, RTX GPUs, audio monitors). Yet when expensive hardware fails, owners face an asymmetric corporate gauntlet:

1. **The Artificial "1-Year Expiration" Illusion:** Manufacturers routinely tell consumers their warranty has expired at 12 months, pocketing repair fees or forcing upgrades.
2. **Ignorance of Statutory Consumer Rights:** Under **UCC § 2-314** (US Implied Warranty of Merchantability) and **EU Directive (EU) 2019/771**, consumer goods carry non-disclaimable legal rights extending up to 24 to 72 months.
3. **Receipt & Serial Chaos:** Receipts are lost in email archives, thermal ink fades, and serial numbers are buried inside nested operating system menus.
4. **Intimidating Dispute Resolution:** Consumers lack the legal drafting skills to challenge corporate denial letters with binding statutory citations.

### The WarrantyVault Breakthrough

**WarrantyVault™** is an autonomous hardware defense operating system. It extracts serial numbers and purchase dates via optical receipt OCR, runs continuous millisecond expiration countdowns, and synthesizes 1-click statutory RMA demand letters citing statutory commercial law.

---

## 🏛️ Autonomous Agent Syndicate

| Agent Identity | Functional Responsibility | Autonomous Behavior |
|:---|:---|:---|
| **`WV-OCR-PARSER`** | Optical Receipt & Serial Intelligence | Parses thermal receipts, PDFs, and invoices to extract hardware model, serial, price, and purchase date in 2.3s. |
| **`WV-COUNTDOWN-SENTINEL`** | 24/7 Precision Telemetry Radar | Computes millisecond-precision timers across both manufacturer warranties and statutory legal protection periods. |
| **`WV-STATUTORY-DRAFTER`** | Statutory RMA Claim Generation | Generates formal legal replacement demand letters citing UCC § 2-314, Magnuson-Moss 15 U.S.C. § 2301, and EU Directive 2019/771. |
| **`WV-DEFENSE-RADAR`** | Portfolio Health & Capital Defense | Computes total capital protected ($8,797.98), hardware health score (96/100), and 12-month expiration risk horizons. |

---

## ⚖️ Statutory Legal Defense Framework

Unlike generic warranty apps, WarrantyVault incorporates enforceable statutory consumer law:

- **Magnuson-Moss Warranty Act (15 U.S.C. § 2301 et seq.):** Prohibits manufacturers from disclaiming or limiting implied warranties when offering express written protection.
- **Uniform Commercial Code (U.C.C. § 2-314):** Guarantees an implied warranty of merchantability ensuring computing goods remain durable and fit for ordinary use.
- **EU Directive (EU) 2019/771 (Sale of Goods):** Mandates a statutory 2-year minimum legal guarantee with reversed burden of proof in consumer electronics.
- **UK Consumer Rights Act 2015 (s.9 & s.10):** Enforces statutory rights for goods to be of satisfactory quality with claim horizons up to 6 years.

---

## 📁 Repository Architecture

```text
Warranty_Vault/
├── index.html                             # Entry point router & marketing showcase
├── frontend/                              # Complete Web App UI & Screen Modules
│   ├── index.html                         # Sovereign Landing Page Router
│   ├── screens_hub.html                   # Visual Screen Catalog & Interactive Navigator
│   ├── 00_auth_login_signup.html          # Biometric Auth Gateway (1-Click Judge Pass)
│   ├── 01_landing_page_full.html          # Marketing Showcase with Interactive ROI Sandbox
│   ├── 02_hardware_vault.html             # Protected Hardware Vault (Live Telemetry & Countdowns)
│   ├── 03_optical_receipt_scanner.html    # Optical Receipt Scanner with Matrix OCR Terminal
│   ├── 04_statutory_claims_studio.html    # Statutory RMA Claims Studio & Demand Letter Engine
│   ├── 05_warranty_defense_intelligence.html # Defense Health Intelligence & Expiration Radar
│   ├── login.html                         # Direct alias for Authentication Gateway
│   ├── vault.html                         # Direct alias for Hardware Vault
│   ├── scanner.html                       # Direct alias for Receipt Scanner
│   ├── claims.html                        # Direct alias for Claims Studio
│   ├── analytics.html                     # Direct alias for Defense Intelligence
│   ├── demo.html                          # Standalone Interactive Sandbox Simulator
│   ├── auth.js                            # Session security guard & biometric auth
│   ├── app.js                             # Reactive countdown timers, OCR & claim generator
│   ├── style.css                          # Dark luxury glassmorphism design system
│   ├── assets/                            # Hardware imagery, receipts, and brand assets
│   └── README.md                          # Frontend architecture documentation
├── backend/                               # Python AI & OCR Microservice
│   ├── server.py                          # FastAPI REST API endpoints
│   ├── requirements.txt                   # FastAPI, Uvicorn, Pydantic, Gemini AI
│   ├── pyproject.toml                     # Python project configuration
│   ├── agents/
│   │   └── claim_drafter.py               # Autonomous legal demand letter drafting agent
│   └── engine/
│       └── ocr_extractor.py               # Optical receipt parser & warranty calculator
├── src/                                   # TypeScript Core Domain Engine
│   ├── types/
│   │   └── warranty.ts                    # Statutory and telemetry type schemas
│   └── engine/
│       └── countdown_engine.ts            # Millisecond countdown calculation engine
├── devpost/                               # Devpost Learn AI Basics Submission Pack
│   ├── scope.md                           # Problem space, target audience & roadmap
│   ├── prd.md                             # Product requirements & user stories
│   ├── spec.md                            # Technical specifications & data models
│   └── checklist.md                       # Comprehensive submission audit
├── scope.md                               # Root project scope document
├── prd.md                                 # Root product requirements document
├── spec.md                                # Root technical specifications document
├── .env.example                           # Environment configuration template
├── .gitignore                             # Clean production gitignore rules
├── vercel.json                            # Edge CDN routing configuration
├── package.json                           # Node tooling, npm scripts & metadata
├── tsconfig.json                          # TypeScript compiler configuration
├── Dockerfile                             # Multi-stage production container
└── README.md                              # Master architectural documentation
```

---

## ⚡ 60-Second Judge Quickstart Tour

Experience the full WarrantyVault platform in under 60 seconds:

### 🌐 Option A: Instant Live Web App (Zero Setup)

1. **Launch the Live Application:**
   Open [**WarrantyVault Live**](https://noorfatima323.github.io/Warranty_Vault/) in your browser.
2. **Access via 1-Click Judge Pass:**
   Navigate to [**Login**](https://noorfatima323.github.io/Warranty_Vault/frontend/login.html) and click the purple **"Enter as Alex Morgan (Judge Pass) ➔"** button for instant biometric access without typing.
3. **Explore the Hardware Vault:**
   In [**Protected Hardware Vault**](https://noorfatima323.github.io/Warranty_Vault/frontend/vault.html), observe the real-time millisecond countdowns tracking $8,797.98 of hardware.
4. **Test the Optical Receipt Scanner:**
   Visit [**Receipt Scanner**](https://noorfatima323.github.io/Warranty_Vault/frontend/scanner.html), click the preset **"MacBook Pro 16 Receipt"**, and watch the terminal matrix parse the model and serial in 2.3 seconds.
5. **Generate a Statutory RMA Demand Letter:**
   In [**Statutory Claims Studio**](https://noorfatima323.github.io/Warranty_Vault/frontend/claims.html), select **"Uniform Commercial Code § 2-314"** or **"EU Directive 2019/771"** to generate an airtight legal replacement notice.

---

### 💻 Option B: Run Locally

```bash
# Clone the repository
git clone https://github.com/NoorFatima323/Warranty_Vault.git
cd Warranty_Vault

# Serve with any local HTTP server
python -m http.server 3000
# or
npx serve .

# Open in browser: http://localhost:3000
```

---

## 🛠️ Complete Tech Stack

- **Frontend:** Vanilla HTML5, Modern CSS3 with dark luxury glassmorphism tokens, and ES6+ Vanilla JavaScript.
- **Telemetry Engine:** Custom TypeScript millisecond precision countdown engine (`src/engine/countdown_engine.ts`).
- **Autonomous Agents:** Python statutory drafting agent (`backend/agents/claim_drafter.py`) and receipt OCR extraction engine (`backend/engine/ocr_extractor.py`).
- **Cloud Backend:** FastAPI REST microservice with CORS support (`backend/server.py`).
- **Design System:** Responsive desktop-first SaaS architecture with left sidepanel navigation, CSS glassmorphism, JetBrains Mono telemetry, and Plus Jakarta Sans typography.

---

## 📄 License & Attribution

Distributed under the **MIT License**. Created by **Noor Fatima** for the Learn AI Basics Hackathon on Devpost.
