/**
 * WarrantyVault — Authentication & Session Manager
 * Handles login, registration, session state, 1-click demo access, and route protection.
 */

(function () {
  'use strict';

  const AUTH_KEY = 'warranty_vault_auth_user';

  const DEFAULT_DEMO_USER = {
    id: 'usr_demo_8829',
    name: 'Alex Morgan',
    email: 'alex.morgan@hardwarevault.io',
    plan: 'Vault Pro • Hardware Defense',
    joined: 'October 2026',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  };

  function getAuthUser() {
    try {
      const data = localStorage.getItem(AUTH_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  function loginUser(userData) {
    const user = { ...DEFAULT_DEMO_USER, ...userData, loggedInAt: Date.now() };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  }

  function logoutUser() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = 'index.html';
  }

  function requireAuth() {
    const user = getAuthUser();
    if (!user) {
      const redirectTarget = encodeURIComponent(window.location.pathname.split('/').pop() || 'vault.html');
      window.location.href = `login.html?redirect=${redirectTarget}`;
      return false;
    }
    return true;
  }

  function checkAuthAndGo(targetPage = 'vault.html') {
    const user = getAuthUser();
    if (user) {
      window.location.href = targetPage;
    } else {
      window.location.href = `login.html?redirect=${targetPage}`;
    }
  }

  // Render user chip in navigation bar if element exists
  function renderNavUserChip() {
    const container = document.getElementById('nav-user-container');
    if (!container) return;

    const user = getAuthUser();
    const pfx = '';
    if (user) {
      container.innerHTML = `
        <div class="user-chip-dropdown" id="user-chip-menu">
          <button type="button" class="nav-user-chip" id="btn-user-profile" title="Signed in as ${user.name}">
            <div class="user-avatar-dot"></div>
            <span class="user-chip-name">${user.name}</span>
            <i data-lucide="chevron-down" class="w-3 h-3 text-white/50"></i>
          </button>
          <div class="user-dropdown-card hidden" id="user-dropdown-card">
            <div class="dropdown-header">
              <span class="dropdown-name">${user.name}</span>
              <span class="dropdown-email">${user.email}</span>
              <span class="dropdown-plan">${user.plan}</span>
            </div>
            <div class="dropdown-divider"></div>
            <a href="${pfx}vault.html" class="dropdown-item"><i data-lucide="hard-drive"></i> Hardware Vault</a>
            <a href="${pfx}scanner.html" class="dropdown-item"><i data-lucide="scan-line"></i> Receipt Scanner</a>
            <a href="${pfx}claims.html" class="dropdown-item"><i data-lucide="scale"></i> Statutory Claims</a>
            <a href="${pfx}analytics.html" class="dropdown-item"><i data-lucide="bar-chart-3"></i> Intelligence & Risk</a>
            <div class="dropdown-divider"></div>
            <button type="button" class="dropdown-item text-red" id="btn-logout-action">
              <i data-lucide="log-out"></i> Sign Out
            </button>
          </div>
        </div>
      `;

      if (window.lucide) lucide.createIcons();

      const profileBtn = document.getElementById('btn-user-profile');
      const dropdownCard = document.getElementById('user-dropdown-card');
      const logoutBtn = document.getElementById('btn-logout-action');

      if (profileBtn && dropdownCard) {
        profileBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          dropdownCard.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
          if (!e.target.closest('#user-chip-menu')) {
            dropdownCard.classList.add('hidden');
          }
        });
      }

      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          logoutUser();
        });
      }
    } else {
      // Unauthenticated: Keep container empty, primary navbar button handles Sign In
      container.innerHTML = '';
    }
  }

  // Export to global scope
  window.WarrantyAuth = {
    getAuthUser,
    loginUser,
    logoutUser,
    requireAuth,
    checkAuthAndGo,
    renderNavUserChip,
    DEFAULT_DEMO_USER
  };

  document.addEventListener('DOMContentLoaded', () => {
    renderNavUserChip();

    // Mobile sidebar toggle handler
    const toggleBtn = document.getElementById('btn-toggle-sidebar');
    const sidebar = document.getElementById('app-sidebar');
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('open');
      });
      document.addEventListener('click', (e) => {
        if (!e.target.closest('#app-sidebar') && !e.target.closest('#btn-toggle-sidebar')) {
          sidebar.classList.remove('open');
        }
      });
    }
  });

})();
