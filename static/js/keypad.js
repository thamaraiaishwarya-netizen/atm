/**
 * Smart ATM Banking System — keypad.js
 * Virtual ATM Numeric Keypad
 * Theme: Dark Navy / Gold / Orbitron + Rajdhani
 */

'use strict';

/* ─────────────────────────────────────────────
   STYLES — injected once into <head>
   ───────────────────────────────────────────── */
(function injectKeypadStyles() {
  const id = 'atm-keypad-styles';
  if (document.getElementById(id)) return;

  const style = document.createElement('style');
  style.id    = id;
  style.textContent = `
    /* ── Keypad wrapper ── */
    .atm-keypad {
      display: inline-flex;
      flex-direction: column;
      gap: 10px;
      background: linear-gradient(145deg, #061A36, #0B2D52);
      border: 1px solid #C5A45D55;
      border-radius: 16px;
      padding: 18px 16px;
      box-shadow:
        0 0 0 1px #FFFFFF0A inset,
        0 8px 32px rgba(0,0,0,0.6),
        0 0 20px rgba(197, 164, 93, 0.08);
      user-select: none;
    }

    /* ── Display area ── */
    .atm-keypad-display {
      background: #061A36;
      border: 1px solid #123F69;
      border-radius: 8px;
      padding: 10px 14px;
      min-height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 4px;
      box-shadow: 0 0 10px rgba(18, 63, 105, 0.5) inset;
      position: relative;
      overflow: hidden;
    }

    /* Scanline shimmer on display */
    .atm-keypad-display::after {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(255,255,255,0.015) 2px,
        rgba(255,255,255,0.015) 4px
      );
      pointer-events: none;
    }

    /* Amount mode text */
    .atm-keypad-display .atm-kp-amount-text {
      font-family: 'Orbitron', monospace;
      font-size: 1.3rem;
      font-weight: 700;
      color: #C5A45D;
      letter-spacing: 2px;
      text-shadow: 0 0 12px rgba(197, 164, 93, 0.6);
    }

    /* PIN dot */
    .atm-kp-dot {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid #C5A45D;
      background: transparent;
      transition: background 0.12s ease, box-shadow 0.12s ease;
      flex-shrink: 0;
    }
    .atm-kp-dot.filled {
      background: #C5A45D;
      box-shadow: 0 0 10px rgba(197, 164, 93, 0.8);
    }

    /* Placeholder text when empty */
    .atm-kp-placeholder {
      font-family: 'Rajdhani', sans-serif;
      color: #FFFFFF33;
      font-size: 0.9rem;
      letter-spacing: 1px;
    }

    /* ── Button grid ── */
    .atm-keypad-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    /* ── Individual key ── */
    .atm-key {
      position: relative;
      overflow: hidden;
      min-width: 64px;
      min-height: 56px;
      border-radius: 10px;
      border: 1px solid #FFFFFF1A;
      background: linear-gradient(145deg, #123F69, #0B2D52);
      color: #FFFFFF;
      font-family: 'Orbitron', sans-serif;
      font-size: 1.1rem;
      font-weight: 600;
      letter-spacing: 1px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition:
        background   0.15s ease,
        box-shadow   0.15s ease,
        transform    0.08s ease,
        border-color 0.15s ease;
      box-shadow: 0 4px 8px rgba(0,0,0,0.4), 0 1px 0 #FFFFFF0D inset;
      -webkit-tap-highlight-color: transparent;
      touch-action: manipulation;
    }

    .atm-key:hover {
      background: linear-gradient(145deg, #1a5080, #123F69);
      border-color: #C5A45D55;
      box-shadow: 0 4px 16px rgba(197, 164, 93, 0.2), 0 1px 0 #FFFFFF0D inset;
    }

    /* Pressed animation */
    .atm-key.pressed {
      transform: scale(0.93) translateY(1px);
      background: linear-gradient(145deg, #0B2D52, #061A36);
      box-shadow: 0 1px 4px rgba(0,0,0,0.6) inset;
      border-color: #C5A45D88;
    }

    /* Ripple effect */
    .atm-key .atm-key-ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(197, 164, 93, 0.25);
      transform: scale(0);
      animation: atm-ripple 0.4s linear;
      pointer-events: none;
    }
    @keyframes atm-ripple {
      to { transform: scale(4); opacity: 0; }
    }

    /* Clear key */
    .atm-key.atm-key-clear {
      background: linear-gradient(145deg, #1a3050, #0B2050);
      color: #FF8080;
      font-size: 0.72rem;
      letter-spacing: 0.5px;
      border-color: rgba(255,128,128,0.2);
    }
    .atm-key.atm-key-clear:hover {
      background: linear-gradient(145deg, #2a1818, #1a1010);
      border-color: rgba(255,128,128,0.5);
    }
    .atm-key.atm-key-clear.pressed {
      background: #1a0808;
    }

    /* Enter key */
    .atm-key.atm-key-enter {
      background: linear-gradient(145deg, #C5A45D, #9e7e3c);
      color: #061A36;
      font-size: 0.72rem;
      letter-spacing: 0.5px;
      border-color: #C5A45D;
      box-shadow: 0 4px 12px rgba(197, 164, 93, 0.35), 0 1px 0 #FFFFFF2A inset;
    }
    .atm-key.atm-key-enter:hover {
      background: linear-gradient(145deg, #d4b46e, #b08d4a);
      box-shadow: 0 4px 20px rgba(197, 164, 93, 0.5), 0 1px 0 #FFFFFF2A inset;
    }
    .atm-key.atm-key-enter.pressed {
      background: #9e7e3c;
      box-shadow: 0 1px 4px rgba(0,0,0,0.5) inset;
    }

    /* Zero key takes full width of its cell */
    .atm-key.atm-key-zero {
      /* sits naturally in the grid */
    }

    /* ── Responsive ── */
    @media (max-width: 400px) {
      .atm-key {
        min-width: 52px;
        min-height: 46px;
        font-size: 0.95rem;
      }
      .atm-keypad {
        padding: 12px 10px;
        gap: 7px;
      }
      .atm-keypad-grid { gap: 6px; }
    }
  `;
  document.head.appendChild(style);
})();


/* ─────────────────────────────────────────────
   CLASS: ATMKeypad
   ───────────────────────────────────────────── */
class ATMKeypad {
  /**
   * @param {Object} config
   * @param {string}   config.targetInputId  — hidden/visible input to populate
   * @param {string}   [config.displayId]    — element id for visual display
   * @param {number}   [config.maxLength]    — max characters (default: 4 for pin, 10 for amount)
   * @param {string}   [config.mode]         — 'pin' | 'amount' (default: 'pin')
   * @param {Function} [config.onEnter]      — callback(value) when Enter pressed
   * @param {string}   [config.placeholder]  — display placeholder text
   */
  constructor(config) {
    this.targetInputId = config.targetInputId || null;
    this.displayId     = config.displayId     || null;
    this.mode          = config.mode          || 'pin';
    this.maxLength     = config.maxLength      != null
      ? config.maxLength
      : (this.mode === 'amount' ? 10 : 4);
    this.onEnter       = config.onEnter       || null;
    this.placeholder   = config.placeholder   ||
      (this.mode === 'pin' ? 'Enter PIN' : 'Enter amount');

    this._value        = '';
    this._container    = null;  // the keypad wrapper element
    this._displayEl    = null;  // resolved display element
  }

  /* ── Public: get current value ── */
  get value() { return this._value; }

  /* ── Public: render into a container element or id ── */
  render(containerId) {
    const container = typeof containerId === 'string'
      ? document.getElementById(containerId)
      : containerId;

    if (!container) {
      console.error('[ATMKeypad] Container not found:', containerId);
      return;
    }

    // Clear any previous render
    container.innerHTML = '';

    // Wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'atm-keypad';

    // ── Display ──────────────────────────────
    const display = document.createElement('div');
    display.className = 'atm-keypad-display';

    // If external displayId provided, skip inline display later
    if (this.displayId) {
      this._displayEl = document.getElementById(this.displayId);
    } else {
      this._displayEl = display;
      wrapper.appendChild(display);
    }

    this._refreshDisplay();

    // ── Grid ─────────────────────────────────
    const grid = document.createElement('div');
    grid.className = 'atm-keypad-grid';

    // Layout: 1 2 3 / 4 5 6 / 7 8 9 / CLR 0 ENT
    const keys = [
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '4', value: '4' },
      { label: '5', value: '5' },
      { label: '6', value: '6' },
      { label: '7', value: '7' },
      { label: '8', value: '8' },
      { label: '9', value: '9' },
      { label: 'CLEAR', value: 'clear',  type: 'clear' },
      { label: '0',     value: '0',      type: 'zero'  },
      { label: 'ENTER', value: 'enter',  type: 'enter' },
    ];

    keys.forEach(function (k) {
      const btn = this._createKey(k);
      grid.appendChild(btn);
    }, this);

    wrapper.appendChild(grid);
    container.appendChild(wrapper);
    this._container = wrapper;
  }

  /* ── Private: create a single key button ── */
  _createKey(keyDef) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = keyDef.label;
    btn.className   = 'atm-key';

    if (keyDef.type === 'clear') btn.classList.add('atm-key-clear');
    if (keyDef.type === 'enter') btn.classList.add('atm-key-enter');
    if (keyDef.type === 'zero')  btn.classList.add('atm-key-zero');

    // Press animation + ripple
    const handlePress = (e) => {
      e.preventDefault();
      this._animatePress(btn, e);
      this._handleKeyValue(keyDef.value);
    };

    btn.addEventListener('pointerdown', handlePress);

    // Fallback click for keyboard/accessibility
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this._animatePress(btn, null);
        this._handleKeyValue(keyDef.value);
      }
    });

    return btn;
  }

  /* ── Private: animate the pressed state + ripple ── */
  _animatePress(btn, event) {
    btn.classList.add('pressed');

    // Ripple
    if (event) {
      const rect   = btn.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      const x      = (event.clientX || rect.left + rect.width  / 2) - rect.left - size / 2;
      const y      = (event.clientY || rect.top  + rect.height / 2) - rect.top  - size / 2;
      const ripple = document.createElement('span');
      ripple.className = 'atm-key-ripple';
      ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    }

    setTimeout(() => btn.classList.remove('pressed'), 180);
  }

  /* ── Private: process a key value ── */
  _handleKeyValue(val) {
    if (val === 'clear') {
      this._clear();
      return;
    }
    if (val === 'enter') {
      this._enter();
      return;
    }

    // Amount mode: handle decimal
    if (this.mode === 'amount') {
      if (val === '.' && this._value.includes('.')) return;
      // Max 2 decimal places
      const parts = this._value.split('.');
      if (parts.length === 2 && parts[1].length >= 2) return;
    }

    if (this._value.length >= this.maxLength) return;

    this._value += val;
    this._syncInput();
    this._refreshDisplay();
  }

  /* ── Private: clear ── */
  _clear() {
    this._value = '';
    this._syncInput();
    this._refreshDisplay();
  }

  /* ── Private: enter / submit ── */
  _enter() {
    if (typeof this.onEnter === 'function') {
      this.onEnter(this._value);
      return;
    }

    // Fallback: submit the nearest form containing the target input
    const input = this.targetInputId
      ? document.getElementById(this.targetInputId)
      : null;

    if (input) {
      const form = input.closest('form');
      if (form) {
        // Fire a submit event so other listeners (validation, guard) run
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        const notCancelled = form.dispatchEvent(submitEvent);
        if (notCancelled) form.submit();
      }
    }
  }

  /* ── Private: sync hidden/visible input ── */
  _syncInput() {
    if (!this.targetInputId) return;
    const input = document.getElementById(this.targetInputId);
    if (input) {
      input.value = this._value;
      input.dispatchEvent(new Event('input',  { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  /* ── Private: refresh the visual display ── */
  _refreshDisplay() {
    const el = this._displayEl;
    if (!el) return;

    el.innerHTML = '';

    if (this._value.length === 0) {
      // Placeholder
      const ph = document.createElement('span');
      ph.className   = 'atm-kp-placeholder';
      ph.textContent = this.placeholder;
      el.appendChild(ph);
      return;
    }

    if (this.mode === 'pin') {
      // Show filled/empty dots up to maxLength
      for (let i = 0; i < this.maxLength; i++) {
        const dot = document.createElement('span');
        dot.className = 'atm-kp-dot' + (i < this._value.length ? ' filled' : '');
        el.appendChild(dot);
      }
    } else {
      // Amount mode — show actual digits
      const span = document.createElement('span');
      span.className = 'atm-kp-amount-text';
      // Format with currency-style: prefix with ₹ or leave raw
      span.textContent = this._value;
      el.appendChild(span);
    }
  }

  /* ── Public: programmatically set value ── */
  setValue(val) {
    this._value = String(val).slice(0, this.maxLength);
    this._syncInput();
    this._refreshDisplay();
  }

  /* ── Public: programmatically clear ── */
  clear() {
    this._clear();
  }

  /* ── Public: destroy the rendered keypad ── */
  destroy() {
    if (this._container) {
      this._container.remove();
      this._container = null;
    }
  }
}


/* ─────────────────────────────────────────────
   GLOBAL FACTORY FUNCTION
   initKeypad(containerId, config) → ATMKeypad instance
   ───────────────────────────────────────────── */
function initKeypad(containerId, config) {
  const keypad = new ATMKeypad(config || {});
  keypad.render(containerId);
  return keypad;
}


/* ─────────────────────────────────────────────
   EXPORTS
   ───────────────────────────────────────────── */
window.ATMKeypad  = ATMKeypad;
window.initKeypad = initKeypad;

// Also attach to the shared ATM namespace if main.js loaded first
window.ATM = window.ATM || {};
window.ATM.Keypad     = ATMKeypad;
window.ATM.initKeypad = initKeypad;
