# Scope Document: WarrantyVault
**Hackathon:** Devpost Build With AI: Basics (`learn-ai-basics.devpost.com`)  
**Project:** WarrantyVault — AI Hardware RMA & Statutory Claim Engine  
**Framework Step:** `2-scope` (Devpost Learn Skill Pack)  
**Status:** Complete & Locked for v1 POC  

---

## 1. The Core Problem
Every year, consumers discard hundreds of millions of dollars worth of repairable, defected consumer electronics (laptops, wireless headphones, monitors, high-end appliances) that are **still legally protected by manufacturer or statutory implied warranties**.

Consumers discard these devices because:
1. **Fading Thermal Receipts:** Paper register receipts fade into illegible blank strips after 3–6 months.
2. **Artificial Retailer Walls:** Retail store staff routinely mislead consumers by stating: *"Our 30-day return window closed; you are on your own."*
3. **Legal Intimidation:** Consumers do not know how to cite mandatory statutory consumer protections like the **Magnuson-Moss Warranty Act**, **UCC § 2-314 (Implied Warranty of Merchantability)**, or **EU Directive 2019/771** to demand an executive RMA replacement.

---

## 2. The Core Solution (The Kernel)
**WarrantyVault** is a privacy-first web application that bridges optical purchase proof extraction, countdown tracking, and 1-click court-compliant statutory RMA demand generation.

### Proof-of-Concept Kernel (What Must Work End-to-End):
- **Authentication Gateway:** Secure login / registration with a 1-click demo access button preloading a verified hardware portfolio.
- **Sidepanel Web App Shell:** Professional SaaS sidebar navigation matching modern productivity apps (Linear / Supabase / Stripe).
- **Receipt OCR Scanner:** Optical proof parsing dropzone with animated matrix OCR terminal and immediate hardware ingestion.
- **Protected Hardware Vault:** Live tracking of 4 consumer hardware devices with active countdown clocks, specs, and status filters.
- **Certified Statutory Claims Engine:** Real-time legal dispute studio allowing users to select defect symptoms and statutory laws (UCC § 2-314, Magnuson-Moss, EU 2019/771, UK CRA 2015) to generate certified demand letters with 1-click clipboard copy and printing.
- **Portfolio Defense Intelligence:** Health score (`96/100`), financial risk exposure, 12-month calendar, and enforceable consumer law codex.

---

## 3. Strict Scope Boundaries

### IN SCOPE (Built for Submission):
- **User Authentication & Session Guard:** `auth.js` session storage with route protection redirecting unauthenticated visitors to `login.html`.
- **Desktop Sidepanel Layout:** Fixed left sidebar panel on all 4 web app screens with active module highlighting and collapsible mobile drawer.
- **Preloaded Hardware Assets:** 4 realistic consumer electronics across Audio, Laptop, Display, and Home Appliance tiers.
- **Interactive RMA Drafting:** Monospace legal letter generator dynamically updating based on target device, observed defect, and selected jurisdiction statute.
- **Search & Filter Pipeline:** Real-time client-side search across device models, brands, retailers, and serial numbers.
- **100% Offline-First Architecture:** Zero backend server setup needed; runs directly in modern web browsers via static assets.

### OUT OF SCOPE (Deferred to v2 / Post-Hackathon):
- Live integration with external credit card banking APIs (Plaid).
- Automated certified postal mail dispatch service (Lob API integration).
- Real-time FTC / State Attorney General electronic filing webhooks.
- Multi-user collaborative household inventory sharing.
