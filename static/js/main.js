/**
 * Smart ATM Banking System — main.js
 * Application-wide JavaScript
 * Theme: Dark Navy / Gold / Orbitron + Rajdhani
 */

'use strict';

/* ─────────────────────────────────────────────
   1. CLOCK & DATE
   ───────────────────────────────────────────── */
function padTwo(n) {
  return String(n).padStart(2, '0');
}

function updateClockAndDate() {
  const now = new Date();

  // ── Clock ──────────────────────────────────
  const clockEl = document.getElementById('atm-clock');
  if (clockEl) {
    const hh = padTwo(now.getHours());
    const mm = padTwo(now.getMinutes());
    const ss = padTwo(now.getSeconds());
    clockEl.textContent = `${hh}:${mm}:${ss}`;
  }

  // ── Date ───────────────────────────────────
  const dateEl = document.getElementById('atm-date');
  if (dateEl) {
    const days  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const dayName  = days[now.getDay()];
    const dd       = padTwo(now.getDate());
    const mon      = months[now.getMonth()];
    const yyyy     = now.getFullYear();
    dateEl.textContent = `${dayName}, ${dd} ${mon} ${yyyy}`;
  }
}

setInterval(updateClockAndDate, 1000);
updateClockAndDate(); // immediate first render


/* ─────────────────────────────────────────────
   2. CARD NUMBER AUTO-FORMATTER
   Format: XXXX XXXX XXXX XXXX
   ───────────────────────────────────────────── */
(function initCardFormatter() {
  document.addEventListener('DOMContentLoaded', function () {
    const cardInput = document.getElementById('card_number');
    if (!cardInput) return;

    cardInput.setAttribute('maxlength', '19'); // 16 digits + 3 spaces
    cardInput.setAttribute('inputmode', 'numeric');
    cardInput.setAttribute('autocomplete', 'cc-number');

    cardInput.addEventListener('input', function (e) {
      let raw = e.target.value.replace(/\D/g, '').slice(0, 16);
      // Insert a space every 4 digits
      let formatted = raw.match(/.{1,4}/g);
      e.target.value = formatted ? formatted.join(' ') : '';
    });

    cardInput.addEventListener('keydown', function (e) {
      // Allow: backspace, delete, tab, arrows
      const allowed = [8, 9, 37, 38, 39, 40, 46];
      if (allowed.includes(e.keyCode)) return;
      // Allow Ctrl+A / Ctrl+C / Ctrl+V / Ctrl+X
      if (e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode)) return;
      // Block non-numeric
      if (!/^[0-9]$/.test(e.key)) e.preventDefault();
    });
  });
})();


/* ─────────────────────────────────────────────
   3. AMOUNT INPUT — numeric/decimal only
   ───────────────────────────────────────────── */
(function initAmountInputs() {
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.amount-input, input[data-type="amount"]').forEach(function (input) {
      input.setAttribute('inputmode', 'decimal');

      input.addEventListener('keydown', function (e) {
        const allowed = [8, 9, 37, 38, 39, 40, 46];
        if (allowed.includes(e.keyCode)) return;
        if (e.ctrlKey && [65, 67, 86, 88].includes(e.keyCode)) return;
        // Allow one dot
        if (e.key === '.' && !e.target.value.includes('.')) return;
        if (!/^[0-9]$/.test(e.key)) e.preventDefault();
      });

      input.addEventListener('input', function (e) {
        // Remove anything that isn't a digit or single dot
        let val = e.target.value.replace(/[^0-9.]/g, '');
        const parts = val.split('.');
        if (parts.length > 2) val = parts[0] + '.' + parts.slice(1).join('');
        // Max 2 decimal places
        if (parts[1] && parts[1].length > 2) {
          val = parts[0] + '.' + parts[1].slice(0, 2);
        }
        e.target.value = val;
      });
    });
  });
})();


/* ─────────────────────────────────────────────
   4. CONFIRMATION MODAL HELPER
   showConfirm(title, message, formId)
   ───────────────────────────────────────────── */
function showConfirm(title, message, formId) {
  // Reuse or create modal
  let modal = document.getElementById('atm-confirm-modal');

  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'atm-confirm-modal';
    modal.className = 'modal fade';
    modal.tabIndex = -1;
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content atm-modal-content">
          <div class="modal-header atm-modal-header">
            <h5 class="modal-title atm-modal-title" id="atm-confirm-title"></h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body atm-modal-body" id="atm-confirm-message"></div>
          <div class="modal-footer atm-modal-footer">
            <button type="button" class="btn atm-btn-cancel" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn atm-btn-confirm" id="atm-confirm-ok">Confirm</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(modal);

    // Apply inline ATM theme styles to modal elements
    const style = document.createElement('style');
    style.textContent = `
      #atm-confirm-modal .atm-modal-content {
        background: #0B2D52;
        border: 1px solid #C5A45D;
        border-radius: 12px;
        color: #FFFFFF;
        font-family: 'Rajdhani', sans-serif;
      }
      #atm-confirm-modal .atm-modal-header {
        background: #061A36;
        border-bottom: 1px solid #C5A45D;
        border-radius: 12px 12px 0 0;
      }
      #atm-confirm-modal .atm-modal-title {
        font-family: 'Orbitron', sans-serif;
        color: #C5A45D;
        font-size: 1rem;
        letter-spacing: 1px;
      }
      #atm-confirm-modal .atm-modal-body {
        font-size: 1.05rem;
        padding: 1.5rem;
      }
      #atm-confirm-modal .atm-modal-footer {
        border-top: 1px solid #123F69;
      }
      #atm-confirm-modal .atm-btn-cancel {
        background: #123F69;
        color: #FFFFFF;
        border: 1px solid #FFFFFF33;
        font-family: 'Rajdhani', sans-serif;
        font-weight: 600;
        letter-spacing: 1px;
      }
      #atm-confirm-modal .atm-btn-cancel:hover { background: #0B2D52; }
      #atm-confirm-modal .atm-btn-confirm {
        background: #C5A45D;
        color: #061A36;
        border: none;
        font-family: 'Orbitron', sans-serif;
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 1px;
      }
      #atm-confirm-modal .atm-btn-confirm:hover { background: #d4b46e; }
    `;
    document.head.appendChild(style);
  }

  document.getElementById('atm-confirm-title').textContent   = title;
  document.getElementById('atm-confirm-message').textContent = message;

  const confirmBtn = document.getElementById('atm-confirm-ok');

  // Clone to strip old listeners
  const freshBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(freshBtn, confirmBtn);

  freshBtn.addEventListener('click', function () {
    const bsModal = bootstrap.Modal.getInstance(modal);
    if (bsModal) bsModal.hide();

    if (formId) {
      const form = document.getElementById(formId);
      if (form) {
        // Temporarily bypass double-submit guard
        form.dataset.submitting = 'confirmed';
        form.submit();
      }
    }
  });

  const bsModal = new bootstrap.Modal(modal, { backdrop: 'static', keyboard: false });
  bsModal.show();
}


/* ─────────────────────────────────────────────
   5. FLASH MESSAGE AUTO-DISMISS (4 seconds)
   ───────────────────────────────────────────── */
(function initFlashMessages() {
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.alert, .flash-message').forEach(function (alert) {
      // Fade out after 4 s
      setTimeout(function () {
        alert.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        alert.style.opacity    = '0';
        alert.style.transform  = 'translateY(-8px)';
        setTimeout(function () { alert.remove(); }, 650);
      }, 4000);
    });
  });
})();


/* ─────────────────────────────────────────────
   6. LOADING OVERLAY
   showLoading() / hideLoading()
   ───────────────────────────────────────────── */
(function initLoadingOverlay() {
  const overlayId = 'atm-loading-overlay';

  function ensureOverlay() {
    let overlay = document.getElementById(overlayId);
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = overlayId;
      overlay.innerHTML = `
        <div class="atm-loading-inner">
          <div class="atm-spinner-ring"></div>
          <p class="atm-loading-text">Processing…</p>
        </div>`;

      const style = document.createElement('style');
      style.textContent = `
        #atm-loading-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(6, 26, 54, 0.88);
          z-index: 9999;
          align-items: center;
          justify-content: center;
          flex-direction: column;
        }
        #atm-loading-overlay.active { display: flex; }
        .atm-loading-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
        }
        .atm-spinner-ring {
          width: 72px;
          height: 72px;
          border: 6px solid #123F69;
          border-top-color: #C5A45D;
          border-radius: 50%;
          animation: atm-spin 0.9s linear infinite;
          box-shadow: 0 0 24px #C5A45D55;
        }
        @keyframes atm-spin { to { transform: rotate(360deg); } }
        .atm-loading-text {
          color: #C5A45D;
          font-family: 'Orbitron', sans-serif;
          font-size: 0.85rem;
          letter-spacing: 2px;
          margin: 0;
          text-shadow: 0 0 10px #C5A45D88;
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(overlay);
    }
    return overlay;
  }

  window.showLoading = function (text) {
    const overlay = ensureOverlay();
    const textEl  = overlay.querySelector('.atm-loading-text');
    if (textEl && text) textEl.textContent = text;
    overlay.classList.add('active');
  };

  window.hideLoading = function () {
    const overlay = document.getElementById(overlayId);
    if (overlay) overlay.classList.remove('active');
  };
})();


/* ─────────────────────────────────────────────
   7. PIN DOTS DISPLAY
   updatePinDisplay(length, maxLength, containerId)
   ───────────────────────────────────────────── */
function updatePinDisplay(length, maxLength, containerId) {
  maxLength   = maxLength   || 4;
  containerId = containerId || 'pin-display';

  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';

  for (let i = 0; i < maxLength; i++) {
    const dot = document.createElement('span');
    dot.className = 'atm-pin-dot' + (i < length ? ' filled' : '');
    container.appendChild(dot);
  }
}

// Inject PIN dot styles once
(function injectPinDotStyles() {
  const id = 'atm-pin-dot-styles';
  if (document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = `
    .atm-pin-dot {
      display: inline-block;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 2px solid #C5A45D;
      background: transparent;
      margin: 0 6px;
      transition: background 0.15s ease, box-shadow 0.15s ease;
      vertical-align: middle;
    }
    .atm-pin-dot.filled {
      background: #C5A45D;
      box-shadow: 0 0 10px #C5A45D99;
    }
  `;
  document.head.appendChild(style);
})();


/* ─────────────────────────────────────────────
   8. PAGE FADE-IN ANIMATION
   ───────────────────────────────────────────── */
(function initPageFadeIn() {
  const style = document.createElement('style');
  style.textContent = `
    body {
      opacity: 0;
      transition: opacity 0.45s ease;
    }
    body.atm-page-ready {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);

  document.addEventListener('DOMContentLoaded', function () {
    requestAnimationFrame(function () {
      document.body.classList.add('atm-page-ready');
    });
  });
})();


/* ─────────────────────────────────────────────
   9. PREVENT DOUBLE-SUBMIT ON FORMS
   ───────────────────────────────────────────── */
(function initDoubleSubmitGuard() {
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('form').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        // Allow confirmed submits (from showConfirm)
        if (form.dataset.submitting === 'confirmed') {
          delete form.dataset.submitting;
          return;
        }
        if (form.dataset.submitting === 'true') {
          e.preventDefault();
          return;
        }
        form.dataset.submitting = 'true';

        // Reset guard after 6 s (network timeout fallback)
        setTimeout(function () {
          form.dataset.submitting = 'false';
        }, 6000);
      });
    });
  });
})();


/* ─────────────────────────────────────────────
   10. QUICK AMOUNT BUTTONS
   Clicking sets value in the amount input field.
   Buttons must have class "quick-amount-btn"
   and data-amount attribute.
   Target input: first .amount-input or #amount
   ───────────────────────────────────────────── */
(function initQuickAmountButtons() {
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.quick-amount-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const amount = btn.dataset.amount;
        if (!amount) return;

        // Find the target amount input (by data-target, .amount-input, or #amount)
        let targetId  = btn.dataset.target;
        let inputEl   = targetId
          ? document.getElementById(targetId)
          : (document.querySelector('.amount-input') || document.getElementById('amount'));

        if (inputEl) {
          inputEl.value = amount;
          inputEl.focus();
          // Dispatch change/input events so other listeners react
          inputEl.dispatchEvent(new Event('input',  { bubbles: true }));
          inputEl.dispatchEvent(new Event('change', { bubbles: true }));
        }

        // Visual active state feedback
        document.querySelectorAll('.quick-amount-btn').forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
      });
    });
  });
})();


/* ─────────────────────────────────────────────
   GLOBAL EXPORTS (for inline scripts / templates)
   ───────────────────────────────────────────── */
window.ATM = window.ATM || {};
Object.assign(window.ATM, {
  showConfirm,
  updatePinDisplay,
  showLoading:  window.showLoading,
  hideLoading:  window.hideLoading,
});
