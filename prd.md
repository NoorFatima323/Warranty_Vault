# Product Requirements Document (PRD): WarrantyVault
**Hackathon:** Devpost Build With AI: Basics (`learn-ai-basics.devpost.com`)  
**Project:** WarrantyVault — AI Hardware RMA & Statutory Claim Engine  
**Framework Step:** `3-prd` (Devpost Learn Skill Pack)  
**Status:** Approved & Implemented  

---

## 1. User Personas
1. **The Pro Consumer / Tech Enthusiast (Alex Morgan):**
   - Owns multiple premium electronics (MacBook Pro, Sony ANC Headphones, 4K Display, Dyson appliance).
   - Needs automated countdown tracking to avoid missing warranty windows.
   - Requires formal legal proof when retailers deny claims after 30 days.

2. **The Budget-Conscious Household Manager:**
   - Wants to avoid losing money re-purchasing prematurely broken appliances.
   - Needs an easy way to store paper receipts before they fade.

---

## 2. User Journeys & End-to-End Flows

### Flow 1: Authentication & Gateway
1. User visits landing overview (`index.html`).
2. User clicks `"Try Live Demo"` or floating quick-access card.
3. System checks session state:
   - If authenticated: navigates directly to `vault.html`.
   - If unauthenticated: redirects to `login.html?redirect=vault.html`.
4. User can sign in, register, or click **`⚡ Instant 1-Click Access`** to authenticate as Alex Morgan.
5. User is redirected to their protected web app dashboard.

### Flow 2: Optical Receipt Scanning & Ingestion
1. User navigates to `scanner.html` via the left sidebar.
2. User drops a receipt image/PDF or selects an evaluation preset (e.g. *BestBuy Sony WH-1000XM5*).
3. The scanning terminal executes an animated multi-step OCR matrix simulation.
4. Extracted metadata (Merchant, Date, Serial Number, Warranty Term) is registered to `localStorage`.
5. An ingestion confirmation banner displays quick actions to view the device in the Vault or check statutory rights.

### Flow 3: Hardware Vault Management & Countdown Tracking
1. User navigates to `vault.html`.
2. Telemetry HUD calculates total covered hardware value (`$3,898.97`) and expiring devices in real time.
3. Interactive search input filters hardware cards by model, serial, or retailer with immediate DOM response.
4. Segmented pills toggle filtering between `All Devices`, `Expiring Soon`, `Active`, and `Expired`.
5. User can click `+ Add Hardware` to register units via manual form modal.

### Flow 4: Certified Statutory RMA Demand Drafting
1. User navigates to `claims.html`.
2. User selects a target hardware unit from the dropdown.
3. User selects the observed defect (e.g. Battery degradation, Logic board failure).
4. User chooses the governing legal jurisdiction:
   - **United States:** Magnuson-Moss Warranty Act & UCC § 2-314
   - **European Union:** Directive (EU) 2019/771 (2-Year Conformity Guarantee)
   - **United Kingdom:** Consumer Rights Act 2015 (6-Year Latent Defect Coverage)
5. The monospace legal letter preview re-compiles instantly with certified reference numbers.
6. User can click **`Copy Text`** to copy the formal letter or **`Print / PDF`** for physical submission.

### Flow 5: Portfolio Defense & Law Codex
1. User navigates to `analytics.html`.
2. Portfolio health score (`96/100`) and legal win rate (`98.4%`) are displayed.
3. 12-month expiration calendar highlights upcoming coverage deadlines.
4. The enforceable consumer statutes codex provides quick legal citations.

---

## 3. UI/UX Aesthetic Standards
- **Theme:** Obsidian luxury dark mode (`#060709`, `#0a0c11`) with curated neon acid (`#c8ff3d`) and emerald (`#10b981`) accents.
- **Sidepanel Navigation:** Fixed 270px left sidebar matching modern desktop SaaS applications (Linear, Supabase, Stripe).
- **Responsive Drawer:** Off-canvas slide-out sidebar navigation for mobile devices.
- **Zero Placeholders:** Realistic hardware photos, realistic serial numbers, and actual legal citations.
