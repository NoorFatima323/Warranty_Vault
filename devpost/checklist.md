# Build & Ship Checklist: WarrantyVault
**Hackathon:** Devpost Build With AI: Basics (`learn-ai-basics.devpost.com`)  
**Project:** WarrantyVault — AI Hardware RMA & Statutory Claim Engine  
**Framework Steps:** `5-build` & `6-ship`  
**Status:** 100% Ready for Final Submission  

---

## 1. Technical Build Verification (Step 5: Build)

- [x] **Repository Root Cleanliness:** Clean project root with static assets, styles, scripts, and documentation.
- [x] **Planning Docs Generated:** `scope.md`, `prd.md`, and `spec.md` present in both root and `devpost/` directory.
- [x] **Auth Gateway:** Gated access on `index.html` routing unauthenticated users to `login.html`.
- [x] **1-Click Instant Demo Access:** Working demo login preloading Alex Morgan's account.
- [x] **Fixed Sidepanel Layout:** Modern desktop SaaS sidebar (`app-sidebar`) with active indicator and responsive drawer.
- [x] **Hardware Vault Screen (`vault.html`):** 4 realistic consumer hardware items, live countdowns, search filter, and telemetry HUD.
- [x] **Receipt Scanner Screen (`scanner.html`):** Laser scanning chassis, 3 instant OCR presets, matrix terminal animation, and ingestion badge.
- [x] **Statutory Claims Studio (`claims.html`):** Formal demand letter compilation citing UCC § 2-314, Magnuson-Moss, EU Directive 2019/771, and UK CRA 2015 with 1-click clipboard copy and printing.
- [x] **Warranty Intelligence Screen (`analytics.html`):** Portfolio health score (`96/100`), 12-month calendar, and enforceable consumer statutes codex.
- [x] **Automated Test Validation:** 100% pass on Playwright multi-screen automated test suite (`scratch/test_multi_screen_app.py`).

---

## 2. Devpost Submission Requirements (Step 6: Ship)

| Item | Requirement | Status | Action Needed by User |
| :--- | :--- | :---: | :--- |
| **Code Repository** | Public GitHub / GitLab URL containing all code & planning markdown files | 🟡 Pending Git Push | Run `git init`, commit files, and push to a new public GitHub repo. |
| **Planning Files** | Must include `scope.md`, `prd.md`, `spec.md` in repository | 🟢 Complete | Generated & verified in repository. |
| **Demo Video** | 1 to 3 minute screen recording demonstrating end-to-end functionality | 🟡 Ready to Record | Record 90s walkthrough using provided script. |
| **Project Name & Pitch** | Title, elevator tagline, and category tags | 🟢 Complete | Ready to copy-paste into Devpost form. |
| **Story / Description** | Inspiration, What it does, How we built it, Challenges, Accomplishments, Learnings, Future roadmap | 🟢 Complete | Ready to copy-paste into Devpost form. |
| **Skill Pack Question** | Short explanation of how `challengepost/learn-ai-basics` was used | 🟢 Complete | Ready to copy-paste into Devpost form. |
