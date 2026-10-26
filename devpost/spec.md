# Technical Architecture Specification (Spec): WarrantyVault
**Hackathon:** Devpost Build With AI: Basics (`learn-ai-basics.devpost.com`)  
**Project:** WarrantyVault — AI Hardware RMA & Statutory Claim Engine  
**Framework Step:** `4-spec` (Devpost Learn Skill Pack)  
**Status:** Approved & Implemented  

---

## 1. System Architecture & Tech Stack

```
+---------------------------------------------------------------------------------+
|                                 CLIENT BROWSER                                  |
|                                                                                 |
|  [ index.html ]  ---- (Gated Auth Redirect) ----> [ login.html ]                 |
|                                                          |                      |
|                                                          v (Session Storage)    |
|                                                   [ auth.js ]                   |
|                                                          |                      |
|      +---------------------------------------------------+                      |
|      |                                                                          |
|      v                                                                          |
|  +---------------------------------------------------------------------------+  |
|  |                 DESKTOP SAAS DASHBOARD (style.css + app.js)               |  |
|  |                                                                           |  |
|  |  +----------------------+  +-------------------------------------------+  |  |
|  |  |   app-sidebar        |  |  app-content-wrapper                      |  |  |
|  |  |                      |  |                                           |  |  |
|  |  |  • Brand Lockup      |  |  • app-topbar (Breadcrumbs & Telemetry)   |  |  |
|  |  |  • + Add Hardware    |  |  • Viewport Screen:                       |  |  |
|  |  |  • Hardware Vault    |  |     - vault.html (4 Tracked Units)        |  |  |
|  |  |  • Receipt Scanner   |  |     - scanner.html (OCR Matrix Engine)    |  |  |
|  |  |  • Statutory Claims  |  |     - claims.html (RMA Letter Studio)     |  |  |
|  |  |  • Intelligence      |  |     - analytics.html (Risk Codex)         |  |  |
|  |  |  • Alex Morgan Card  |  |                                           |  |  |
|  |  +----------------------+  +-------------------------------------------+  |  |
|  +---------------------------------------------------------------------------+  |
|                                      |                                          |
|                                      v                                          |
|                       LOCAL STORAGE PERSISTENCE LAYER                           |
|       ('warranty_vault_nivo_v1' + 'warranty_vault_auth_user')                   |
+---------------------------------------------------------------------------------+
```

- **Frontend Core:** Pure HTML5, Vanilla JavaScript (ES6+), Vanilla CSS3 (Custom Design System).
- **Zero Build Step:** 100% static client-side application. No npm compile, bundler, or Node.js runtime required to evaluate the POC.
- **Icons & Effects:** Lucide Icons (CDN), Canvas Confetti (CDN).
- **Typography:** Google Fonts (`Outfit`, `Inter`, `Inter Tight`, `JetBrains Mono`).

---

## 2. Data Models & Schemas

### Device Schema (`warranty_vault_nivo_v1`)
```typescript
interface HardwareDevice {
  id: string;              // Unique key e.g. "dev_sony_xm5_..."
  name: string;            // Product name e.g. "Sony WH-1000XM5 Wireless Headphones"
  brand: string;           // Manufacturer e.g. "Sony"
  category: string;        // "Audio Gear" | "Laptop Workstation" | "Kitchen Appliance" | "Mobile Device"
  retailer: string;        // Store name e.g. "Best Buy #0492"
  purchaseDate: string;    // ISO YYYY-MM-DD
  warrantyMonths: number;  // 6 | 12 | 24 | 36 | 60
  price: number;           // Purchase price in USD
  serialNumber: string;    // Hardware serial or IMEI
  storeAddress?: string;   // Physical store address
  notes?: string;          // Extracted receipt notes
}
```

### Auth User Session Schema (`warranty_vault_auth_user`)
```typescript
interface AuthUser {
  id: string;              // "usr_demo_8829"
  name: string;            // "Alex Morgan"
  email: string;           // "alex.morgan@hardwarevault.io"
  plan: string;            // "Vault Pro • Hardware Defense"
  joined: string;          // "October 2026"
  avatar: string;          // Avatar URL
  loggedInAt: number;      // Epoch timestamp
}
```

---

## 3. Core Modules & Component Architecture

1. **`auth.js` (Session Manager & Guard):**
   - `getAuthUser()`: Retrieves and parses user session from `localStorage`.
   - `loginUser(userData)`: Sets active session.
   - `logoutUser()`: Purges session and redirects to `index.html`.
   - `requireAuth()`: Route guard executing on every app screen.
   - `renderNavUserChip()`: Dynamic rendering of profile card and upward menu.

2. **`app.js` (Vault & Claim Logic):**
   - `loadDevices()` / `saveDevices()`: Syncs devices to `localStorage`.
   - `getWarrantyTimeline(device)`: Calculates remaining days, expiry date, elapsed percentage, and status (`active`, `expiring`, `expired`).
   - `renderHardwareGrid()`: Reactive DOM renderer for hardware cards.
   - `simulateReceiptScan(presetKey, customFile)`: Multi-step asynchronous OCR pipeline with terminal logging.
   - `generateLegalLetter()`: Dynamic compiler generating certified RMA demand notices based on statutory jurisdiction.

3. **`style.css` (Design System):**
   - Matte obsidian palette tokens (`#060709`, `#0a0c11`, `#0d1017`).
   - High-contrast neon accents: Acid Green (`#c8ff3d`), Emerald (`#10b981`), Cyan (`#38bdf8`), Amber (`#fbbf24`), Red (`#f87171`).
   - Fixed desktop sidepanel layout (`.app-layout-shell`, `.app-sidebar`, `.app-topbar`, `.app-viewport-body`).
