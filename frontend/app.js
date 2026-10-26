/**
 * WarrantyVault — NIVO One Creator Kit Application Logic
 * Reactive State Management, Hardware Specs Engine & Statutory RMA Generator
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'warranty_vault_nivo_v1';

  // Relative Date Helper: Ensures countdowns are always fresh relative to today
  function getDateOffset(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    return d.toISOString().split('T')[0];
  }

  const SEED_DEVICES = [
    {
      id: 'dev_sony_xm5',
      name: 'Sony WH-1000XM5 Wireless Headphones',
      brand: 'Sony',
      category: 'Audio Gear',
      retailer: 'Best Buy #0492',
      purchaseDate: getDateOffset(-342), // 342 days ago -> ~23 days remaining on 12-month (365d) warranty
      warrantyMonths: 12,
      price: 399.99,
      serialNumber: 'SN-S01-9482910-E',
      storeAddress: '10900 Westheimer Rd, Houston, TX 77042',
      notes: 'Thermal store receipt scanned. 23 days remaining on 1-year limited coverage.'
    },
    {
      id: 'dev_macbook_pro',
      name: 'Apple MacBook Pro 14" M3 Pro',
      brand: 'Apple',
      category: 'Laptop Workstation',
      retailer: 'Apple Fifth Avenue',
      purchaseDate: getDateOffset(-117), // 117 days ago -> ~248 days active coverage
      warrantyMonths: 12,
      price: 1999.00,
      serialNumber: 'C02GH381MD6R',
      storeAddress: '767 5th Ave, New York, NY 10153',
      notes: 'PDF invoice parsed. Apple 1-Year Limited Hardware Warranty active.'
    },
    {
      id: 'dev_ninja_airfryer',
      name: 'Ninja Foodi DualZone Air Fryer (8-Qt)',
      brand: 'SharkNinja',
      category: 'Kitchen Appliance',
      retailer: 'Target Stores #1820',
      purchaseDate: getDateOffset(-425), // 425 days ago -> Expired standard coverage, eligible for statutory claim
      warrantyMonths: 12,
      price: 199.99,
      serialNumber: 'NJ-840219-DZ',
      storeAddress: '1200 S University Ave, Little Rock, AR 72204',
      notes: 'Expired 60 days ago. Prime candidate for Statutory Latent Defect Claim under UCC § 2-314.'
    },
    {
      id: 'dev_samsung_s24',
      name: 'Samsung Galaxy S24 Ultra 512GB',
      brand: 'Samsung',
      category: 'Mobile Device',
      retailer: 'Samsung Online Store',
      purchaseDate: getDateOffset(-185), // 185 days ago -> ~180 days active
      warrantyMonths: 12,
      price: 1299.99,
      serialNumber: 'R5CW3098EFA-IMEI',
      storeAddress: '85 Challenger Rd, Ridgefield Park, NJ 07660',
      notes: 'Samsung Standard Warranty with Knox security hardware coverage.'
    }
  ];

  // ==================== REACTIVE STATE ====================
  let devices = [];
  let currentFilter = 'all';
  let searchQuery = '';
  let activeClaimDevice = null;
  let activeReceiptDevice = null;

  function loadDevices() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        devices = JSON.parse(stored);
      } else {
        devices = JSON.parse(JSON.stringify(SEED_DEVICES));
        saveDevices();
      }
    } catch (e) {
      console.warn('LocalStorage error, using defaults', e);
      devices = JSON.parse(JSON.stringify(SEED_DEVICES));
    }
  }

  function saveDevices() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
    updateNavbarMetrics();
  }

  // ==================== WARRANTY TIMELINE CALCULATION ====================
  function getWarrantyTimeline(device) {
    const purchase = new Date(device.purchaseDate);
    const totalDays = Math.round(device.warrantyMonths * 30.4375);
    const expiry = new Date(purchase.getTime() + totalDays * 24 * 60 * 60 * 1000);
    const now = new Date();

    const msRemaining = expiry.getTime() - now.getTime();
    const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));

    const msElapsed = now.getTime() - purchase.getTime();
    const totalDurationMs = expiry.getTime() - purchase.getTime();
    let percentElapsed = Math.min(100, Math.max(0, (msElapsed / totalDurationMs) * 100));

    let status = 'active'; // 'active', 'expiring', 'expired'
    if (daysRemaining <= 0) {
      status = 'expired';
      percentElapsed = 100;
    } else if (daysRemaining <= 30) {
      status = 'expiring';
    }

    return {
      daysRemaining,
      expiryDate: expiry.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      percentElapsed: Math.round(percentElapsed),
      status
    };
  }

  // ==================== NAVBAR METRICS ====================
  function updateNavbarMetrics() {
    let totalVal = 0;
    let expiringCount = 0;

    devices.forEach(dev => {
      totalVal += Number(dev.price) || 0;
      const timeline = getWarrantyTimeline(dev);
      if (timeline.status === 'expiring') expiringCount++;
    });

    const formattedVal = `$${totalVal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const navTotal = document.getElementById('nav-total-val');
    const navExp = document.getElementById('nav-expiring-val');
    const countBadge = document.getElementById('inventory-count-badge');

    if (navTotal) navTotal.textContent = formattedVal;
    if (navExp) navExp.textContent = `${expiringCount} ${expiringCount === 1 ? 'Item' : 'Items'}`;
    if (countBadge) countBadge.textContent = `${devices.length} Devices Tracked`;
  }

  // ==================== HARDWARE CARDS GRID RENDERER ====================
  function renderHardwareGrid() {
    const gridEl = document.getElementById('warranty-grid');
    const emptyEl = document.getElementById('vault-empty-state');
    if (!gridEl) return;

    gridEl.innerHTML = '';

    const filtered = devices.filter(dev => {
      const timeline = getWarrantyTimeline(dev);
      const matchesFilter = (currentFilter === 'all') || (timeline.status === currentFilter);

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        dev.name.toLowerCase().includes(q) ||
        dev.brand.toLowerCase().includes(q) ||
        dev.serialNumber.toLowerCase().includes(q) ||
        dev.category.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
      gridEl.classList.add('hidden');
      if (emptyEl) emptyEl.classList.remove('hidden');
      return;
    } else {
      gridEl.classList.remove('hidden');
      if (emptyEl) emptyEl.classList.add('hidden');
    }

    filtered.forEach(dev => {
      const timeline = getWarrantyTimeline(dev);
      const card = document.createElement('div');
      card.className = `hardware-card status-${timeline.status}`;
      card.dataset.id = dev.id;

      let pillText = '';
      let daysDisplay = '';
      let progressColor = 'green';

      if (timeline.status === 'expired') {
        pillText = 'EXPIRED';
        daysDisplay = `Expired ${Math.abs(timeline.daysRemaining)} Days Ago`;
        progressColor = 'red';
      } else if (timeline.status === 'expiring') {
        pillText = `⚠️ EXPIRING SOON (${timeline.daysRemaining}D)`;
        daysDisplay = `${timeline.daysRemaining} Days Coverage Left`;
        progressColor = 'amber';
      } else {
        pillText = `✓ ACTIVE`;
        daysDisplay = `${timeline.daysRemaining} Days Coverage Left`;
        progressColor = 'green';
      }

      const formattedPrice = Number(dev.price).toLocaleString('en-US', { minimumFractionDigits: 2 });
      const purchaseFormatted = new Date(dev.purchaseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      card.innerHTML = `
        <div class="card-header-line">
          <div>
            <span class="category-badge-chip">${escapeHtml(dev.category || 'Hardware')}</span>
            <div><span class="status-pill-badge ${timeline.status}">${pillText}</span></div>
          </div>
          <button class="card-delete-icon-btn" title="Remove device from vault" data-action="delete" data-id="${dev.id}">
            <i data-lucide="trash-2"></i>
          </button>
        </div>

        <h3 class="product-headline">${escapeHtml(dev.name)}</h3>
        <div class="product-retailer-sub">
          <span>${escapeHtml(dev.brand)}</span> &bull; 
          <span>${escapeHtml(dev.retailer || 'Retail Store')}</span>
        </div>

        <div class="card-timeline-box">
          <div class="timeline-label-row">
            <span>COVERAGE TIMELINE</span>
            <span>EXPIRES: ${timeline.expiryDate}</span>
          </div>
          <div class="timeline-big-stat ${timeline.status}">
            ${daysDisplay}
          </div>
          <div class="timeline-progress-bar">
            <div class="timeline-progress-fill ${progressColor}" style="width: ${timeline.percentElapsed}%;"></div>
          </div>
        </div>

        <div class="tech-specs-table">
          <div class="spec-row">
            <span class="spec-key">Purchase Date</span>
            <span class="spec-value">${purchaseFormatted}</span>
          </div>
          <div class="spec-row">
            <span class="spec-key">Covered Value</span>
            <span class="spec-value">$${formattedPrice}</span>
          </div>
          <div class="spec-row">
            <span class="spec-key">Warranty Term</span>
            <span class="spec-value">${dev.warrantyMonths} Months OEM</span>
          </div>
          <div class="spec-row">
            <span class="spec-key">Serial / IMEI</span>
            <span class="spec-value">
              ${escapeHtml(dev.serialNumber)}
              <button class="copy-serial-mini-btn" title="Copy serial number" data-action="copy-serial" data-serial="${escapeHtml(dev.serialNumber)}">
                <i data-lucide="copy"></i>
              </button>
            </span>
          </div>
        </div>

        <div class="card-actions-row">
          <button class="btn-nivo-claim" data-action="claim" data-id="${dev.id}">
            <i data-lucide="file-text"></i>
            <span>File Statutory RMA Claim</span>
          </button>
          <div class="card-actions-subrow">
            <button class="btn-nivo-ghost w-full" data-action="view-receipt" data-id="${dev.id}">
              <i data-lucide="receipt"></i>
              <span>View Proof Receipt</span>
            </button>
          </div>
        </div>
      `;

      gridEl.appendChild(card);
    });

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // ==================== TOAST NOTIFICATIONS ====================
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `nivo-toast ${type}`;

    let iconName = 'check-circle';
    if (type === 'warning') iconName = 'alert-triangle';
    if (type === 'info') iconName = 'info';

    toast.innerHTML = `
      <i data-lucide="${iconName}"></i>
      <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3600);
  }

  // ==================== SIMULATED AI OCR SCANNER ====================
  function simulateReceiptScan(presetKey = null, customFile = null) {
    const overlay = document.getElementById('scanner-terminal-overlay');
    const fill = document.getElementById('scan-progress-fill');
    const titleEl = document.getElementById('scan-terminal-title');
    const logEl = document.getElementById('scan-terminal-log');

    if (!overlay) return;

    overlay.classList.remove('hidden');
    fill.style.width = '15%';

    let deviceToIngest = null;

    if (presetKey === 'sony') {
      deviceToIngest = {
        id: 'dev_sony_xm5_' + Date.now(),
        name: 'Sony WH-1000XM5 Wireless Headphones',
        brand: 'Sony',
        category: 'Audio Gear',
        retailer: 'Best Buy #0492',
        purchaseDate: getDateOffset(-342),
        warrantyMonths: 12,
        price: 399.99,
        serialNumber: 'SN-S01-9482910-E',
        storeAddress: '10900 Westheimer Rd, Houston, TX 77042',
        notes: 'Thermal receipt parsed. 23 days left on 12-month manufacturer limited coverage.'
      };
    } else if (presetKey === 'macbook') {
      deviceToIngest = {
        id: 'dev_macbook_' + Date.now(),
        name: 'Apple MacBook Pro 14" M3 Pro',
        brand: 'Apple',
        category: 'Laptop Workstation',
        retailer: 'Apple Fifth Avenue',
        purchaseDate: getDateOffset(-117),
        warrantyMonths: 12,
        price: 1999.00,
        serialNumber: 'C02GH381MD6R',
        storeAddress: '767 5th Ave, New York, NY 10153',
        notes: 'Apple Store invoice parsed. 248 days active coverage.'
      };
    } else if (presetKey === 'airfryer') {
      deviceToIngest = {
        id: 'dev_ninja_' + Date.now(),
        name: 'Ninja Foodi DualZone Air Fryer (8-Qt)',
        brand: 'SharkNinja',
        category: 'Kitchen Appliance',
        retailer: 'Target Stores #1820',
        purchaseDate: getDateOffset(-425),
        warrantyMonths: 12,
        price: 199.99,
        serialNumber: 'NJ-840219-DZ',
        storeAddress: '1200 S University Ave, Little Rock, AR 72204',
        notes: 'Expired 60 days ago. Prime candidate for Statutory Latent Defect Claim under UCC § 2-314.'
      };
    } else {
      const fileName = customFile ? customFile.name.replace(/\.[^/.]+$/, "") : "Electronic Hardware";
      deviceToIngest = {
        id: 'dev_scanned_' + Date.now(),
        name: fileName.length > 3 ? (fileName.charAt(0).toUpperCase() + fileName.slice(1)) : 'Dyson V15 Detect Vacuum',
        brand: 'Dyson / OEM',
        category: 'Kitchen Appliance',
        retailer: 'Authorized Retail Node',
        purchaseDate: getDateOffset(-65),
        warrantyMonths: 24,
        price: 749.99,
        serialNumber: 'DY-' + Math.floor(100000 + Math.random() * 900000),
        storeAddress: '640 N Michigan Ave, Chicago, IL 60611',
        notes: 'Scanned via WarrantyVault Optical Character Engine.'
      };
    }

    const steps = [
      { pct: 30, title: 'Preprocessing Image & Contrast Gradients...', log: '> Detecting store receipt header & thermal font contours...' },
      { pct: 60, title: 'Extracting Merchant, Dates & SKU Details...', log: `> Found merchant: ${deviceToIngest.retailer} | Date: ${deviceToIngest.purchaseDate}` },
      { pct: 85, title: 'Parsing Serial Number & Statutory Terms...', log: `> Extracted Model: ${deviceToIngest.name} | S/N: ${deviceToIngest.serialNumber}` },
      { pct: 100, title: 'Coverage Verified & Cryptographically Signed!', log: `> Warranty calculated: ${deviceToIngest.warrantyMonths} Months coverage confirmed.` }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const s = steps[currentStep];
        fill.style.width = `${s.pct}%`;
        titleEl.textContent = s.title;
        logEl.innerHTML = `<code>${escapeHtml(s.log)}</code>`;
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          overlay.classList.add('hidden');

          const existingIdx = devices.findIndex(d => d.serialNumber === deviceToIngest.serialNumber);
          if (existingIdx !== -1) {
            devices[existingIdx] = deviceToIngest;
          } else {
            devices.unshift(deviceToIngest);
          }
          saveDevices();
          renderHardwareGrid();

          const resultCard = document.getElementById('extraction-result-card');
          const resDeviceName = document.getElementById('extracted-device-name');
          const resDeviceMeta = document.getElementById('extracted-device-meta');
          if (resultCard) {
            resultCard.classList.remove('hidden');
            if (resDeviceName) resDeviceName.textContent = `Verified: ${deviceToIngest.name}`;
            if (resDeviceMeta) resDeviceMeta.textContent = `S/N: ${deviceToIngest.serialNumber} • ${deviceToIngest.retailer} • ${deviceToIngest.warrantyMonths} Months Legal Protection`;
            resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }

          if (window.confetti) {
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.65 }
            });
          }

          showToast(`Verified and registered: ${deviceToIngest.name}!`, 'success');

          const grid = document.getElementById('warranty-grid');
          if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 400);
      }
    }, 450);
  }

  // ==================== RMA CLAIM GENERATOR ====================
  function openClaimModal(deviceId) {
    const dev = devices.find(d => d.id === deviceId);
    if (!dev) return;

    activeClaimDevice = dev;
    const modal = document.getElementById('modal-claim-backdrop');
    const summaryEl = document.getElementById('claim-target-summary');
    const defectDetailsEl = document.getElementById('claim-defect-details');

    const timeline = getWarrantyTimeline(dev);

    if (summaryEl) {
      summaryEl.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <strong style="color:#ffffff; font-size:0.92rem;">${escapeHtml(dev.name)}</strong>
          <span class="status-pill-badge ${timeline.status}" style="font-size:0.62rem;">${timeline.status.toUpperCase()}</span>
        </div>
        <div style="font-size:0.75rem; color:#94a3b8; display:flex; gap:12px; flex-wrap:wrap;">
          <span><strong>Brand:</strong> ${escapeHtml(dev.brand)}</span>
          <span><strong>Serial:</strong> <code style="color:#38bdf8;">${escapeHtml(dev.serialNumber)}</code></span>
          <span><strong>Value:</strong> $${Number(dev.price).toFixed(2)}</span>
          <span><strong>Purchased:</strong> ${dev.purchaseDate}</span>
        </div>
      `;
    }

    if (defectDetailsEl && !defectDetailsEl.value) {
      defectDetailsEl.value = `Device ceased functioning during standard, intended consumer usage without drop, moisture intrusion, or customer misuse.`;
    }

    generateLegalLetter();

    if (modal) modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  }

  function generateLegalLetter() {
    if (!activeClaimDevice) return;

    const dev = activeClaimDevice;
    const defectTypeEl = document.getElementById('claim-defect-type');
    const defectDetailsEl = document.getElementById('claim-defect-details');
    const jurisdictionEl = document.getElementById('claim-legal-jurisdiction');
    const remedyEl = document.getElementById('claim-remedy-requested');
    const letterContentEl = document.getElementById('letter-content');
    const emailBtn = document.getElementById('btn-email-claim');

    const defectText = defectTypeEl ? defectTypeEl.options[defectTypeEl.selectedIndex].text : 'Internal hardware failure';
    const defectDetails = (defectDetailsEl && defectDetailsEl.value.trim()) ? defectDetailsEl.value.trim() : 'Ceased operating under standard consumer usage.';
    const jurisdiction = jurisdictionEl ? jurisdictionEl.value : 'US';
    const remedy = remedyEl ? remedyEl.options[remedyEl.selectedIndex].text : 'Replacement unit';

    const todayStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const purchaseFormatted = new Date(dev.purchaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const claimRef = 'RMA-' + Math.floor(100000 + Math.random() * 900000) + '-' + dev.brand.substring(0, 3).toUpperCase();

    let legalStatuteParagraph = '';
    if (jurisdiction === 'us_ucc' || jurisdiction === 'US') {
      legalStatuteParagraph = `This claim is formally submitted pursuant to the Magnuson-Moss Warranty Act (15 U.S.C. § 2301 et seq.) and Uniform Commercial Code (UCC) § 2-314 regarding the Implied Warranty of Merchantability. Under applicable statutory consumer provisions, this merchandise was purchased with the reasonable expectation of enduring fitness for ordinary purpose without premature component breakdown.`;
    } else if (jurisdiction === 'eu_2019' || jurisdiction === 'UK_EU') {
      legalStatuteParagraph = `This formal claim is submitted pursuant to Directive (EU) 2019/771 on the Sale of Goods and statutory conformity guarantees. These directives establish a strict mandatory 2-year minimum statutory conformity guarantee that consumer electronics must be durable, free from latent manufacturing flaws, and conform to the contract beyond nominal marketing limitations.`;
    } else if (jurisdiction === 'uk_cra') {
      legalStatuteParagraph = `This formal claim is submitted pursuant to the UK Consumer Rights Act 2015 (Sections 9 & 10). Under British statutory law, consumer goods must be of satisfactory quality, fit for purpose, and durable for up to six (6) years from date of purchase.`;
    } else {
      legalStatuteParagraph = `This claim is submitted under statutory consumer protection regulations and fair trading standards governing non-conforming consumer merchandise and inherent manufacturing defects.`;
    }

    const formalBody = `FORMAL NOTICE OF WARRANTY CLAIM & RMA REPLACEMENT DEMAND
CERTIFIED REFERENCE: ${claimRef}
DATE: ${todayStr}

ATTENTION: Warranty Administration & Product Support Services
MANUFACTURER / BRAND: ${dev.brand} Product Support
RE: Formal Demand for Statutory Remedy on Defective Merchandise

1. MERCHANDISE & PURCHASE SPECIFICATION
• Product Description: ${dev.name}
• Serial Number / IMEI: ${dev.serialNumber}
• Purchase Date: ${purchaseFormatted}
• Authorized Vendor: ${dev.retailer}
• Purchase Price Paid: $${Number(dev.price).toFixed(2)} USD
• Registered Claimant: Verified Consumer Proof-of-Purchase Holder

2. STATEMENT OF FAILURE & DEFECT
The aforementioned device has experienced an unprompted, severe failure under standard, non-abusive usage conditions:
• Defect Classification: ${defectText}
• Specific Symptoms & Observations: ${defectDetails}
This defect is internal, non-cosmetic, and not the result of unauthorized modification, physical trauma, or moisture contact.

3. STATUTORY LEGAL BASIS
${legalStatuteParagraph}

4. FORMAL DEMAND FOR RESOLUTION
Pursuant to consumer protection statutes, I hereby exercise my right to the following remedy:
>> DEMANDED REMEDY: ${remedy}

Please provide:
(a) An official Return Merchandise Authorization (RMA) tracking number;
(b) A prepaid return shipping label;
(c) Written confirmation of remedy dispatch within fourteen (14) business days of receipt.

Failure to resolve this claim within statutory timelines may result in formal escalations to the Federal Trade Commission (FTC), State Attorney General Consumer Division, and respective dispute conciliation tribunals.

I have attached/retained the original verified digital proof-of-purchase.

Sincerely,

[Authorized Claimant Name]
[Contact Phone / Email]
[Return Mailing Address]`;

    if (letterContentEl) {
      letterContentEl.textContent = formalBody;
    }

    if (emailBtn) {
      const subject = encodeURIComponent(`Formal Warranty RMA Claim: ${dev.name} (SN: ${dev.serialNumber}) [Ref: ${claimRef}]`);
      const body = encodeURIComponent(formalBody);
      emailBtn.href = `mailto:support@${dev.brand.toLowerCase().replace(/[^a-z0-9]/g, '')}.com?subject=${subject}&body=${body}`;
    }
  }

  // ==================== DIGITAL THERMAL RECEIPT ====================
  function openReceiptModal(deviceId) {
    const dev = devices.find(d => d.id === deviceId);
    if (!dev) return;

    activeReceiptDevice = dev;
    const modal = document.getElementById('modal-receipt-backdrop');
    const paperEl = document.getElementById('receipt-paper-render');

    if (paperEl) {
      const purchaseFormatted = new Date(dev.purchaseDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
      const priceNum = Number(dev.price);
      const taxNum = priceNum * 0.0825;
      const totalNum = priceNum + taxNum;

      paperEl.innerHTML = `
        <div class="rcpt-header-name">${escapeHtml(dev.retailer)}</div>
        <div class="rcpt-address">${escapeHtml(dev.storeAddress || '100 Technology Plaza, San Jose, CA')}</div>
        <div class="rcpt-detail-row"><span>REGISTER: 04</span><span>TXN #948201</span></div>
        <div class="rcpt-detail-row"><span>DATE: ${purchaseFormatted}</span><span>TIME: 14:38:20</span></div>
        <div class="rcpt-line-divider"></div>
        <div class="rcpt-detail-row bold">
          <span>${escapeHtml(dev.name)}</span>
          <span>$${priceNum.toFixed(2)}</span>
        </div>
        <div class="rcpt-detail-row" style="font-size:0.65rem; color:#64748b;">
          <span>S/N: ${escapeHtml(dev.serialNumber)}</span>
          <span>1 UNIT</span>
        </div>
        <div class="rcpt-detail-row" style="font-size:0.65rem; color:#64748b;">
          <span>WTY: ${dev.warrantyMonths}MO MFR LIMITED</span>
          <span>INCL</span>
        </div>
        <div class="rcpt-line-divider"></div>
        <div class="rcpt-detail-row"><span>SUBTOTAL</span><span>$${priceNum.toFixed(2)}</span></div>
        <div class="rcpt-detail-row"><span>STATE TAX (8.25%)</span><span>$${taxNum.toFixed(2)}</span></div>
        <div class="rcpt-detail-row bold" style="font-size:0.9rem; margin-top:5px;">
          <span>TOTAL PAID</span>
          <span>$${totalNum.toFixed(2)}</span>
        </div>
        <div class="rcpt-line-divider"></div>
        <div class="rcpt-detail-row" style="font-size:0.64rem;">
          <span>PAYMENT METHOD:</span>
          <span>VISA CHIP ************4821</span>
        </div>
        <div class="rcpt-detail-row" style="font-size:0.64rem;">
          <span>AUTH CODE:</span>
          <span>084920 / APPROVED</span>
        </div>
        <div style="margin: 14px 0 6px 0; text-align: center;">
          <svg viewBox="0 0 200 40" preserveAspectRatio="none" style="width:100%; max-width:240px; height:36px;">
            <rect x="0" y="0" width="3" height="40" fill="#000" />
            <rect x="5" y="0" width="2" height="40" fill="#000" />
            <rect x="10" y="0" width="5" height="40" fill="#000" />
            <rect x="18" y="0" width="2" height="40" fill="#000" />
            <rect x="23" y="0" width="4" height="40" fill="#000" />
            <rect x="30" y="0" width="2" height="40" fill="#000" />
            <rect x="35" y="0" width="6" height="40" fill="#000" />
            <rect x="44" y="0" width="3" height="40" fill="#000" />
            <rect x="50" y="0" width="2" height="40" fill="#000" />
            <rect x="55" y="0" width="7" height="40" fill="#000" />
            <rect x="65" y="0" width="2" height="40" fill="#000" />
            <rect x="70" y="0" width="4" height="40" fill="#000" />
            <rect x="77" y="0" width="3" height="40" fill="#000" />
            <rect x="83" y="0" width="6" height="40" fill="#000" />
            <rect x="92" y="0" width="2" height="40" fill="#000" />
            <rect x="97" y="0" width="5" height="40" fill="#000" />
            <rect x="105" y="0" width="3" height="40" fill="#000" />
            <rect x="111" y="0" width="4" height="40" fill="#000" />
            <rect x="118" y="0" width="2" height="40" fill="#000" />
            <rect x="123" y="0" width="7" height="40" fill="#000" />
            <rect x="133" y="0" width="3" height="40" fill="#000" />
            <rect x="139" y="0" width="5" height="40" fill="#000" />
            <rect x="147" y="0" width="2" height="40" fill="#000" />
            <rect x="152" y="0" width="6" height="40" fill="#000" />
            <rect x="161" y="0" width="3" height="40" fill="#000" />
            <rect x="167" y="0" width="2" height="40" fill="#000" />
            <rect x="172" y="0" width="5" height="40" fill="#000" />
            <rect x="180" y="0" width="4" height="40" fill="#000" />
            <rect x="187" y="0" width="2" height="40" fill="#000" />
            <rect x="192" y="0" width="6" height="40" fill="#000" />
          </svg>
          <div style="font-size:0.6rem; letter-spacing:0.1em; color:#64748b; margin-top:2px;">
            * WV-CRYPTO-${dev.serialNumber.replace(/[^a-zA-Z0-9]/g, '')} *
          </div>
        </div>
        <div style="text-align:center;">
          <span class="rcpt-verified-stamp">VERIFIED PROOF OF PURCHASE &bull; VALID</span>
        </div>
      `;
    }

    if (modal) modal.classList.remove('hidden');
    if (window.lucide) lucide.createIcons();
  }

  // ==================== MANUAL SUBMIT ====================
  function handleManualSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('input-product-name').value.trim();
    const brand = document.getElementById('input-brand').value.trim();
    const category = document.getElementById('input-category').value;
    const retailer = document.getElementById('input-retailer').value.trim() || 'Retailer';
    const purchaseDate = document.getElementById('input-purchase-date').value;
    const warrantyMonths = parseInt(document.getElementById('input-warranty-months').value, 10) || 12;
    const price = parseFloat(document.getElementById('input-price').value) || 0;
    const serialNumber = document.getElementById('input-serial').value.trim() || ('SN-' + Math.floor(1000000 + Math.random() * 9000000));

    if (!name || !brand || !purchaseDate) {
      alert('Please fill all required fields.');
      return;
    }

    const newDevice = {
      id: 'dev_custom_' + Date.now(),
      name,
      brand,
      category,
      retailer,
      purchaseDate,
      warrantyMonths,
      price,
      serialNumber,
      storeAddress: `${retailer} Store`,
      notes: 'Manually registered into NIVO Vault.'
    };

    devices.unshift(newDevice);
    saveDevices();
    renderHardwareGrid();

    document.getElementById('modal-manual-backdrop').classList.add('hidden');
    document.getElementById('form-manual-entry').reset();

    if (window.confetti) {
      confetti({ particleCount: 40, spread: 55, origin: { y: 0.7 } });
    }

    showToast(`Registered "${name}" to Hardware Vault!`, 'success');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ==================== EVENT LISTENERS ====================
  function initEvents() {
    // Search
    const searchInput = document.getElementById('vault-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderHardwareGrid();
      });
    }

    // Filter Tabs
    const filterTabs = document.getElementById('filter-tabs');
    if (filterTabs) {
      filterTabs.addEventListener('click', (e) => {
        const btn = e.target.closest('.tab-btn');
        if (!btn) return;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderHardwareGrid();
      });
    }

    // Presets
    document.querySelectorAll('.preset-pill-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = btn.dataset.preset;
        simulateReceiptScan(preset);
      });
    });

    // Dropzone / File Browse
    const dropzone = document.getElementById('dropzone-area');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('btn-browse-file');

    if (browseBtn && fileInput) {
      browseBtn.addEventListener('click', () => fileInput.click());
    }

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          simulateReceiptScan(null, e.target.files[0]);
        }
      });
    }

    if (dropzone) {
      ['dragenter', 'dragover'].forEach(evt => {
        dropzone.addEventListener(evt, (e) => {
          e.preventDefault();
          dropzone.classList.add('dragover');
        });
      });
      ['dragleave', 'drop'].forEach(evt => {
        dropzone.addEventListener(evt, (e) => {
          e.preventDefault();
          dropzone.classList.remove('dragover');
        });
      });
      dropzone.addEventListener('drop', (e) => {
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
          simulateReceiptScan(null, e.dataTransfer.files[0]);
        }
      });
    }

    // Manual Modal Trigger
    const btnNavManual = document.getElementById('btn-open-manual-nav');
    const btnHeroManual = document.getElementById('btn-open-manual-hero');
    const manualModal = document.getElementById('modal-manual-backdrop');

    [btnNavManual, btnHeroManual].forEach(btn => {
      if (btn && manualModal) {
        btn.addEventListener('click', () => {
          manualModal.classList.remove('hidden');
          if (window.lucide) lucide.createIcons();
        });
      }
    });

    const btnCloseManual = document.getElementById('btn-close-manual');
    const btnCancelManual = document.getElementById('btn-cancel-manual');
    [btnCloseManual, btnCancelManual].forEach(b => {
      if (b && manualModal) {
        b.addEventListener('click', () => manualModal.classList.add('hidden'));
      }
    });

    // Form Submit
    const manualForm = document.getElementById('form-manual-entry');
    if (manualForm) manualForm.addEventListener('submit', handleManualSubmit);

    // Claim Modal Close
    const btnCloseClaim = document.getElementById('btn-close-claim');
    const claimModal = document.getElementById('modal-claim-backdrop');
    if (btnCloseClaim && claimModal) {
      btnCloseClaim.addEventListener('click', () => claimModal.classList.add('hidden'));
    }

    // Receipt Modal Close
    const btnCloseReceipt = document.getElementById('btn-close-receipt');
    const receiptModal = document.getElementById('modal-receipt-backdrop');
    if (btnCloseReceipt && receiptModal) {
      btnCloseReceipt.addEventListener('click', () => receiptModal.classList.add('hidden'));
    }

    // Claim form reactive changes
    ['claim-defect-type', 'claim-defect-details', 'claim-legal-jurisdiction', 'claim-remedy-requested'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', generateLegalLetter);
        el.addEventListener('input', generateLegalLetter);
      }
    });

    const btnRegen = document.getElementById('btn-regenerate-letter');
    if (btnRegen) btnRegen.addEventListener('click', generateLegalLetter);

    // Copy Claim Text
    const btnCopyClaim = document.getElementById('btn-copy-claim');
    if (btnCopyClaim) {
      btnCopyClaim.addEventListener('click', () => {
        const text = document.getElementById('letter-content').innerText;
        navigator.clipboard.writeText(text).then(() => {
          showToast('Certified legal claim letter copied to clipboard!', 'success');
        }).catch(() => {
          showToast('Failed to copy. Please select and copy manually.', 'warning');
        });
      });
    }

    // Print Claim
    const btnPrintClaim = document.getElementById('btn-print-claim');
    if (btnPrintClaim) {
      btnPrintClaim.addEventListener('click', () => window.print());
    }

    // Proceed to claim from receipt modal
    const btnClaimFromReceipt = document.getElementById('btn-claim-from-receipt');
    if (btnClaimFromReceipt && receiptModal) {
      btnClaimFromReceipt.addEventListener('click', () => {
        if (activeReceiptDevice) {
          receiptModal.classList.add('hidden');
          openClaimModal(activeReceiptDevice.id);
        }
      });
    }

    // Print receipt
    const btnDownloadReceipt = document.getElementById('btn-download-receipt-png');
    if (btnDownloadReceipt) {
      btnDownloadReceipt.addEventListener('click', () => window.print());
    }

    // Reset Demo Data
    const btnResetDemo = document.getElementById('btn-reset-demo');
    const btnEmptyReset = document.getElementById('btn-empty-reset');
    [btnResetDemo, btnEmptyReset].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          devices = JSON.parse(JSON.stringify(SEED_DEVICES));
          saveDevices();
          renderHardwareGrid();
          showToast('Sample demo hardware units restored!', 'info');
        });
      }
    });

    // Card Actions Delegation
    const gridEl = document.getElementById('warranty-grid');
    if (gridEl) {
      gridEl.addEventListener('click', (e) => {
        const claimBtn = e.target.closest('[data-action="claim"]');
        if (claimBtn) {
          openClaimModal(claimBtn.dataset.id);
          return;
        }

        const receiptBtn = e.target.closest('[data-action="view-receipt"]');
        if (receiptBtn) {
          openReceiptModal(receiptBtn.dataset.id);
          return;
        }

        const deleteBtn = e.target.closest('[data-action="delete"]');
        if (deleteBtn) {
          const id = deleteBtn.dataset.id;
          const dev = devices.find(d => d.id === id);
          if (confirm(`Remove "${dev ? dev.name : 'this item'}" from your vault?`)) {
            devices = devices.filter(d => d.id !== id);
            saveDevices();
            renderHardwareGrid();
            showToast('Device removed from vault.', 'info');
          }
          return;
        }

        const copySerialBtn = e.target.closest('[data-action="copy-serial"]');
        if (copySerialBtn) {
          const serial = copySerialBtn.dataset.serial;
          navigator.clipboard.writeText(serial).then(() => {
            showToast(`Copied Serial: ${serial}`, 'info');
          });
          return;
        }
      });
    }

    // Backdrop Click Close
    [claimModal, receiptModal, manualModal].forEach(backdrop => {
      if (backdrop) {
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) {
            backdrop.classList.add('hidden');
          }
        });
      }
    });

    // (Legacy demo trigger removed in favor of modular page routing)

    // Back to Landing Page Button
    const backBtn = document.getElementById('btn-back-to-landing');
    if (backBtn) {
      backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openLandingView();
      });
    }
  }

  // ==================== VIEW CONTROLLER ====================
  function openDemoView(autoScroll = true) {
    if (!window.location.pathname.endsWith('demo.html')) {
      window.location.href = 'demo.html';
      return;
    }
    const appView = document.getElementById('app-view');
    if (appView) {
      appView.style.display = 'block';
      appView.classList.remove('hidden');
    }
    if (autoScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (window.lucide) {
      lucide.createIcons();
    }
    renderHardwareGrid();
  }

  function openLandingView(autoScroll = true) {
    window.location.href = 'index.html';
  }

  function openManualModal() {
    const modal = document.getElementById('modal-manual-backdrop');
    if (modal) {
      modal.classList.remove('hidden');
      if (window.lucide) lucide.createIcons();
    }
  }

  // Export functions globally
  window.openWarrantyApp = openDemoView;
  window.closeWarrantyApp = openLandingView;
  window.openClaimModal = openClaimModal;
  window.generateLegalLetter = generateLegalLetter;
  window.simulateReceiptScan = simulateReceiptScan;
  window.WarrantyApp = {
    loadDevices,
    saveDevices,
    renderHardwareGrid,
    getWarrantyTimeline,
    getDevices: () => devices,
    openClaimModal,
    openReceiptModal,
    openManualModal,
    generateLegalLetter,
    simulateReceiptScan,
    setActiveClaimDevice: (dev) => { activeClaimDevice = dev; }
  };

  // ==================== INITIALIZATION ====================
  document.addEventListener('DOMContentLoaded', () => {

    const isDemoPage = !!document.getElementById('app-view') || 
                       !!document.getElementById('warranty-grid') || 
                       !!document.getElementById('dropzone-area') || 
                       !!document.getElementById('select-claim-device');
    if (isDemoPage) {
      loadDevices();
      renderHardwareGrid();
      initEvents();

      const dateInput = document.getElementById('input-purchase-date');
      if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
      }
      if (window.lucide) {
        lucide.createIcons();
      }
    }

    // Check hash on initial load
    if (window.location.hash === '#demo') {
      window.location.href = 'vault.html';
    }
  });

})();
