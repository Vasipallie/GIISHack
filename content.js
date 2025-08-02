(function() {
  // --- Open-Dyslexic font face for dyslexic option
  const fontStyle = document.createElement('style');
  fontStyle.textContent = `
    @font-face {
      font-family: 'Open-Dyslexic';
      font-style: normal;
      font-weight: 400;
      src: local('Open-Dyslexic'), url('https://fonts.cdnfonts.com/s/29616/open-dyslexic.woff') format('woff');
    }
    .a11y-dyslexic-font {
      font-family: 'Open-Dyslexic', Arial, sans-serif !important;
    }
  `;
  document.head.appendChild(fontStyle);

  // --- Modern UI Styles + robust inheritance for spacing & line height + black menu text
  const style = document.createElement('style');
  style.textContent = `
    html { --a11y-fontsize: 100%; --a11y-letterspace:0px; --a11y-lineheight:1.6; }
    .a11y-font-size, .a11y-font-size * { font-size: var(--a11y-fontsize) !important; }
    .a11y-letterspace, .a11y-letterspace * { letter-spacing: var(--a11y-letterspace) !important; }
    .a11y-lineheight, .a11y-lineheight * { line-height: var(--a11y-lineheight) !important; }
    .a11y-highlight-title { box-shadow: 0 0 0 4px #2563eb !important; border-radius: 7px; }
    .a11y-highlight-link { box-shadow: 0 0 0 3px #ef4444 !important; border-radius: 5px; }
    .a11y-bold-font * { font-weight: 700 !important; }
    .a11y-monochrome { filter: grayscale(1) !important; }
    .a11y-highcontrast { filter: contrast(1.65) brightness(1.05) !important; }
    .a11y-lowcontrast { filter: contrast(0.6) !important; }
    .a11y-lowsat { filter: saturate(0.5) !important; }
    .a11y-highsat { filter: saturate(2) !important; }
    .a11y-darkcontrast { filter: invert(1) hue-rotate(180deg) contrast(1.9) brightness(0.84) !important; background:#222 !important; }

    /* Sidebar UI styling */
    .a11y-ui-group { display: flex; gap: 14px; flex-wrap: wrap; margin: 16px 0 10px 0 }
    .a11y-ui-btn, .a11y-ui-toggle {
      background: #f3f4f6; color: #000 !important; border: none; border-radius: 14px;
      box-shadow: 0 1.5px 8px #0001; padding: 12px 16px; margin: 0 0 10px 0; font-size: 1em; min-width: 48px;
      display: flex; gap: 9px; align-items: center; font-family: inherit;
      transition: background 0.09s, box-shadow 0.12s; cursor: pointer; outline: none;
    }
    .a11y-ui-btn:hover, .a11y-ui-toggle:hover { background: #e6eefd; box-shadow: 0 3px 12px #0051ff14; }
    .a11y-ui-toggle.a11y-active { background: #2563eb; color: #fff !important; }
    .a11y-ui-title { margin: 0 0 19px 0; font-size: 1.22em; font-weight: bold; color: #000 !important; font-family: inherit; letter-spacing: 0.01em;}
    .a11y-ui-label { font-size:1em; color: #000 !important; font-weight: 500; margin-bottom:5px;}
    .a11y-ui-toggle { flex:1 0 31%; justify-content:left; font-weight: 500;}
    #a11y-sidebar {
      position: fixed; top: 0; right: 0; z-index: 100000;
      display: flex; flex-direction: column; align-items: flex-end; min-height: 100vh;
    }
    #a11y-panel {
      margin-top:58px;
      background: #fff;
      border-radius: 20px 0 0 18px;
      border: 1.5px solid #dde3f0;
      padding: 27px 26px 21px 27px;
      min-width: 340px;
      box-shadow: 0 8px 34px 0 #2a5ae336;
      display: none;
      flex-direction: column; gap: 2px; font-family: inherit;
      animation: fadeA11yIn 0.28s cubic-bezier(.5,1,.11,1.07);
      color: #000 !important;
    }
    @keyframes fadeA11yIn { 0%{opacity:0;transform:translateY(-10px);} 100%{opacity:1;transform:translateY(0);} }
    #a11y-toggle {
      margin: 15px 20px 0 0;
      background: #2563eb;
      color: #fff;
      border: none;
      border-radius: 100vw;
      box-shadow: 0 1.5px 8px #0001;
      padding: 12px 16px;
      font-size: 27px;
      cursor: pointer;
      outline: none;
      transition: background 0.14s;
      z-index: 100001;
      box-shadow: 0 2px 14px #2563eb13;
      display: flex; align-items: center; justify-content:center;
    }
    #a11y-toggle svg { transition: filter 0.13s; }
    #a11y-toggle:hover { background: #234ccb;}
    #a11y-toggle:hover svg { filter: drop-shadow(0 0 3px #2563eb68);}
    .a11y-ui-fontbar {
      display:flex;align-items:center;gap:12px;padding:6px 0 5px 0;
      background: #f5f6fa90; border-radius: 12px; margin-bottom: 11px;
    }
    .a11y-ui-sliderbar { display:flex; align-items:center; gap:10px; margin-top:6px; margin-bottom:12px;}
    .a11y-ui-slider {
      width: 82px; accent-color: #2563eb; height:3px; border-radius:7px;
      background:#e0eafe;
    }
    .a11y-ui-fontbar-btn { font-size:18px;width:32px;height:32px;line-height:32px;
      background: #eff2f7;border-radius:8px;border:none;
      font-weight:bold;color:#2563eb;display:flex;align-items:center;justify-content:center;cursor:pointer;
      transition:box-shadow 0.13s,background 0.10s;
    }
    .a11y-ui-fontbar-btn:hover { background: #d7e1fc;}
    .a11y-ui-fontbar-value {color: #000 !important; font-weight:bold;min-width:53px;text-align:center;font-size:1em}
    .a11y-modebar { display:flex;gap:11px;flex-wrap:wrap; margin-bottom:6px;}
    .a11y-ui-modebtn {
      padding: 8px 13px; font-size:.99em; border-radius: 10px; border:none;
      background: #f5f5fa; color: #000 !important; font-weight: 500; cursor:pointer;
      transition: background 0.10s;
    }
    .a11y-ui-modebtn.active { background: #2563eb; color: #fff !important; }
    #a11y-reading-guide-canvas { pointer-events:none; position:fixed; left:0; top:0; z-index:999999; }
  `;
  document.head.appendChild(style);

  // --- Build UI ----------
  // Universal accessibility blue SVG
  const a11ySVG = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="13" stroke="#2563eb" stroke-width="2" fill="#eef3ff"/><circle cx="14" cy="7.6" r="2" fill="#2563eb"/><rect x="8" y="12" width="12" height="2.5" rx="1.2" fill="#2563eb"/><rect x="13" y="14.5" width="2" height="7" rx="1" fill="#2563eb"/><rect x="7.9" y="13.7" width="2" height="7" rx="1" transform="rotate(-26 7.9 13.7)" fill="#2563eb"/><rect x="18.2" y="13.7" width="2" height="7" rx="1" transform="rotate(26 18.2 13.7)" fill="#2563eb"/></svg>`;

  function createIcon(svg) {
    return `<span aria-hidden="true" style="display:inline-flex;align-items:center">${svg}</span>`;
  }

  const sidebar = document.createElement('div');
  sidebar.id = 'a11y-sidebar';
  sidebar.innerHTML = `
    <button id="a11y-toggle" aria-label="Open accessibility menu" title="Open accessibility menu">${a11ySVG}</button>
    <section id="a11y-panel" role="region" aria-label="Accessibility Controls">
      <div class="a11y-ui-title" style="margin-bottom:2px;">Accessibility Menu</div>
      <div class="a11y-ui-label" aria-hidden="true">Content Adjustments</div>
      <div class="a11y-ui-fontbar" title="Adjust font size">
        <button id="a11y-font-minus" class="a11y-ui-fontbar-btn" aria-label="Decrease font size">−</button>
        <span id="a11y-font-label" class="a11y-ui-fontbar-value" aria-live="polite" aria-atomic="true">100%</span>
        <button id="a11y-font-plus" class="a11y-ui-fontbar-btn" aria-label="Increase font size">+</button>
      </div>
      <div class="a11y-ui-sliderbar">
        <span style="min-width:92px;font-size:.97em">Letter space</span>
        <input type="range" id="a11y-letterspace" min="0" max="6" step="1" value="0" class="a11y-ui-slider"/>
        <span id="a11y-letterspace-value" style="min-width:29px;text-align:right;font-size:.97em">Normal</span>
      </div>
      <div class="a11y-ui-sliderbar">
        <span style="min-width:92px;font-size:.97em">Line height</span>
        <input type="range" id="a11y-lineheight" min="0" max="6" step="1" value="3" class="a11y-ui-slider"/>
        <span id="a11y-lineheight-value" style="min-width:29px;text-align:right;font-size:.97em">1.6</span>
      </div>
      <div class="a11y-ui-group">
        <button id="a11y-highlight-titles" class="a11y-ui-toggle">${createIcon('<svg width="17" height="17" viewBox="0 0 20 20"><text x="3" y="17" font-size="18" font-family="+apple-system,BlinkMacSystemFont,sans-serif" fill="#2563eb" font-weight="bold">T</text></svg>')} Highlight Title</button>
        <button id="a11y-highlight-links" class="a11y-ui-toggle">${createIcon('<svg width="17" height="17" viewBox="0 0 18 18"><rect x="2" y="4" width="14" height="10" rx="3" fill="none" stroke="#ef4444" stroke-width="2"/><line x1="6" y1="9" x2="12" y2="9" stroke="#ef4444" stroke-width="2"/></svg>')} Highlight Links</button>
        <button id="a11y-dyslexic" class="a11y-ui-toggle">${createIcon('<svg width="17" height="17" viewBox="0 0 17 17"><ellipse cx="8.5" cy="8.5" rx="7.5" ry="7.3" fill="#e0e7ff" stroke="#2563eb" stroke-width="2"/><text x="4.8" y="12" font-size="7.5" font-family="Arial" fill="#2563eb" font-weight="bold">Aa</text></svg>')} Dyslexia Font</button>
      </div>
      <div class="a11y-ui-group" style="gap:11px">
        <button id="a11y-fontweight" class="a11y-ui-toggle">${createIcon('<svg width="17" height="17" viewBox="0 0 20 20"><text x="3" y="17" font-size="18" font-family="Arial" fill="#333" font-weight="bold">B</text></svg>')} Bold Font</button>
        <button id="a11y-reading-guide" class="a11y-ui-toggle">${createIcon('<svg width="18" height="18" viewBox="0 0 21 21"><rect x="2" y="8.5" width="17" height="4" rx="2" fill="#fbbf24" stroke="#a16207" stroke-width="0.6"/><rect x="2.2" y="2" width="16.6" height="13" rx="2.5" fill="none" stroke="#a16207" stroke-width="1.2"/></svg>')} Reading Guide</button>
      </div>
      <div class="a11y-ui-label" style="margin-top:14px;" aria-hidden="true">Color & Contrast Modes</div>
      <div class="a11y-modebar" style="margin-bottom:9px;">
        <button id="a11y-monochrome"  class="a11y-ui-modebtn" data-class="a11y-monochrome">Monochrome</button>
        <button id="a11y-highcontrast" class="a11y-ui-modebtn" data-class="a11y-highcontrast">High Contrast</button>
        <button id="a11y-lowcontrast"  class="a11y-ui-modebtn" data-class="a11y-lowcontrast">Low Contrast</button>
        <button id="a11y-lowsat"       class="a11y-ui-modebtn" data-class="a11y-lowsat">Low Saturation</button>
        <button id="a11y-highsat"      class="a11y-ui-modebtn" data-class="a11y-highsat">High Saturation</button>
        <button id="a11y-darkcontrast" class="a11y-ui-modebtn" data-class="a11y-darkcontrast">Dark Contrast</button>
      </div>
      <div class="a11y-ui-label" style="margin-top:14px;" aria-hidden="true">Other Tools</div>
      <div class="a11y-ui-group">
        <button id="a11y-bigcursor" class="a11y-ui-toggle">${createIcon('<svg width="19" height="19" viewBox="0 0 19 19"><polygon points="2,2 18,9 10,11 15,18 7,13 7,11" fill="#2A5AE3" stroke="#1d3557" stroke-width="1.6" /></svg>')} Big Cursor</button>
        <button id="a11y-magnify" class="a11y-ui-toggle">${createIcon('<svg width="18" height="18" viewBox="0 0 22 22"><circle cx="10" cy="10" r="6.5" fill="none" stroke="#2563eb" stroke-width="2"/><line x1="16.5" y1="16.5" x2="20" y2="20" stroke="#2563eb" stroke-width="2"/></svg>')} Magnify</button>
      </div>
      <div class="a11y-ui-group" style="margin-top:12px; justify-content:center;">
        <button id="a11y-live-translate" class="a11y-ui-btn" style="min-width:100%;">
          <span aria-hidden="true" style="display:inline-flex;align-items:center; margin-right:6px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 12v2"></path>
              <path d="M6 9v6"></path>
              <path d="M10 7v10"></path>
              <path d="M14 4v16"></path>
              <path d="M18 9v6"></path>
              <path d="M22 12v2"></path>
            </svg>
          </span>
          LiveTranslate
        </button>
      </div>
    </section>
  `;
  document.body.appendChild(sidebar);

  // --- Show/hide panel
  const toggleBtn = document.getElementById('a11y-toggle');
  const panel = document.getElementById('a11y-panel');
  toggleBtn.onclick = () => {
    panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
    panel.setAttribute('aria-hidden', panel.style.display !== 'block');
  };

  // --- Font size controls
  let fontSize = 100;
  const fontLabel = document.getElementById('a11y-font-label');
  function setFontSize(size) {
    fontSize = Math.max(100, Math.min(size, 300));
    document.documentElement.style.setProperty('--a11y-fontsize', fontSize + '%');
    fontLabel.textContent = fontSize + '%';
    document.body.classList.add('a11y-font-size');
  }
  document.getElementById('a11y-font-minus').onclick = () => setFontSize(fontSize - 10);
  document.getElementById('a11y-font-plus').onclick = () => setFontSize(fontSize + 10);
  setFontSize(100);

  // --- Letter Spacing Slider
  const letterSpaceSteps = [0, 0.5, 1.5, 3, 4.5, 6, 9]; // px
  const letterSpaceLabels = ["Normal", "0.5px", "1.5px", "3px", "4.5px", "6px", "9px"];
  const letterSlider = document.getElementById('a11y-letterspace');
  const letterLabel = document.getElementById('a11y-letterspace-value');
  letterSlider.oninput = function() {
    const idx = +this.value;
    document.documentElement.style.setProperty('--a11y-letterspace', letterSpaceSteps[idx] + 'px');
    letterLabel.textContent = letterSpaceLabels[idx];
    document.body.classList.add('a11y-letterspace');
  };
  letterSlider.value = 0;
  letterSlider.oninput();

  // --- Line Height Slider
  const lineHeightSteps = [1, 1.2, 1.4, 1.6, 1.8, 2.1, 2.5];
  const lineHeightLabels = ["1.0", "1.2", "1.4", "1.6", "1.8", "2.1", "2.5"];
  const lineSlider = document.getElementById('a11y-lineheight');
  const lineLabel = document.getElementById('a11y-lineheight-value');
  lineSlider.oninput = function() {
    const idx = +this.value;
    document.documentElement.style.setProperty('--a11y-lineheight', lineHeightSteps[idx]);
    lineLabel.textContent = lineHeightLabels[idx];
    document.body.classList.add('a11y-lineheight');
  };
  lineSlider.value = 3;
  lineSlider.oninput();

  // --- Toggle helpers for buttons ---
  function toggleBtnUI(btn, on) {
    if (on) btn.classList.add('a11y-active');
    else btn.classList.remove('a11y-active');
    btn.setAttribute('aria-pressed', !!on);
  }

  // --- Highlight titles
  const titlesBtn = document.getElementById('a11y-highlight-titles');
  let titlesOn = false;
  titlesBtn.onclick = function() {
    titlesOn = !titlesOn;
    for (let i = 1; i <= 6; i++)
      document.querySelectorAll('h' + i).forEach(el => el.classList.toggle('a11y-highlight-title', titlesOn));
    toggleBtnUI(this, titlesOn);
  };

  // --- Highlight links
  const linksBtn = document.getElementById('a11y-highlight-links');
  let linksOn = false;
  linksBtn.onclick = function() {
    linksOn = !linksOn;
    document.querySelectorAll('a').forEach(el => el.classList.toggle('a11y-highlight-link', linksOn));
    toggleBtnUI(this, linksOn);
  };

  // --- Dyslexic font
  const dysBtn = document.getElementById('a11y-dyslexic');
  let dysOn = false;
  dysBtn.onclick = function() {
    dysOn = !dysOn;
    document.body.classList.toggle('a11y-dyslexic-font', dysOn);
    toggleBtnUI(this, dysOn);
  };

  // --- Font weight
  const weightBtn = document.getElementById('a11y-fontweight');
  let weightOn = false;
  weightBtn.onclick = function() {
    weightOn = !weightOn;
    document.body.classList.toggle('a11y-bold-font', weightOn);
    toggleBtnUI(this, weightOn);
  };

  // --- Reading Guide (clear strip along mouse Y)
  const guideBtn = document.getElementById('a11y-reading-guide');
  let guideOn = false,
    guideCanvas = null;
  function drawGuide(y) {
    if (!guideCanvas) return;
    const ctx = guideCanvas.getContext('2d');
    const w = window.innerWidth,
      h = window.innerHeight,
      stripHeight = 80;
    guideCanvas.width = w;
    guideCanvas.height = h;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillRect(0, 0, w, h);
    ctx.clearRect(0, y - stripHeight / 2, w, stripHeight);
  }
  function guideMove(e) {
    drawGuide(e.clientY || window.innerHeight / 2);
  }
  guideBtn.onclick = function() {
    guideOn = !guideOn;
    if (guideOn) {
      guideCanvas = document.createElement('canvas');
      guideCanvas.id = 'a11y-reading-guide-canvas';
      document.body.appendChild(guideCanvas);
      window.addEventListener('resize', () => drawGuide(window.innerHeight / 2));
      document.addEventListener('mousemove', guideMove);
      drawGuide(window.innerHeight / 2);
    } else {
      if (guideCanvas) guideCanvas.remove();
      guideCanvas = null;
      document.removeEventListener('mousemove', guideMove);
      window.removeEventListener('resize', () => drawGuide(window.innerHeight / 2));
    }
    toggleBtnUI(this, guideOn);
  };

  // --- Color/contrast modes
  const bodyModes = [
    "a11y-monochrome",
    "a11y-highcontrast",
    "a11y-lowcontrast",
    "a11y-lowsat",
    "a11y-highsat",
    "a11y-darkcontrast"
  ];
  const modeBtns = bodyModes.map(mode => {
    return document.getElementById(mode.replace('a11y-', 'a11y-'));
  });
  let activeMode = null;
  modeBtns.forEach((btn, idx) => {
    btn.onclick = function() {
      bodyModes.forEach(cls => document.body.classList.remove(cls));
      modeBtns.forEach(b => b.classList.remove('active'));
      if (activeMode !== idx) {
        document.body.classList.add(bodyModes[idx]);
        btn.classList.add('active');
        activeMode = idx;
      } else {
        activeMode = null;
      }
    };
  });

  // --- Big Cursor: XL pointer using SVG (Apple-like modern)
  const bigCursorBtn = document.getElementById('a11y-bigcursor');
  let bigCursorOn = false;
  const svgCursor = `data:image/svg+xml;base64,${btoa('<svg height="64" width="64" xmlns="http://www.w3.org/2000/svg"><polygon points="4,4 60,32 34,36 48,60 28,48 28,36" stroke="#2059e3" stroke-width="5" fill="#ffffff"/><polygon points="4,4 60,32 34,36 48,60 28,48 28,36" stroke="#2059e3" stroke-width="2" fill="#2a5ae3" fill-opacity="0.2"/></svg>')}`;

  function setBigCursor(on) {
    if (on) {
      document.body.style.setProperty('cursor', `url(${svgCursor}) 2 2, auto`, 'important');
      Array.from(document.querySelectorAll('body *')).forEach(el => {
        if (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA" && el.tagName !== "SELECT") {
          el.style.setProperty('cursor', `url(${svgCursor}) 2 2, auto`, 'important');
        }
      });
    } else {
      document.body.style.removeProperty('cursor');
      Array.from(document.querySelectorAll('body *')).forEach(el => el.style.removeProperty('cursor'));
    }
  }
  bigCursorBtn.onclick = function() {
    bigCursorOn = !bigCursorOn;
    setBigCursor(bigCursorOn);
    toggleBtnUI(this, bigCursorOn);
  };

  // --- Magnifier ---
  const magBtn = document.getElementById('a11y-magnify');
  let magOn = false,
    magLens = null;
  magBtn.onclick = function() {
    magOn = !magOn;
    if (magOn) {
      magLens = document.createElement('div');
      magLens.style.cssText = `
        position:fixed;pointer-events:none;z-index:1000000;
        border:4px solid #333;
        border-radius:50%;
        box-shadow:0 2px 10px #0006;
        width:180px;height:180px;overflow:hidden;background: white;
      `;
      magLens.id = 'magnify-lens';
      document.body.appendChild(magLens);
      let clonedPage = null;

      function createClonedPage() {
        if (clonedPage) return;
        clonedPage = document.documentElement.cloneNode(true);
        clonedPage.querySelector('#a11y-sidebar')?.remove();
        clonedPage.querySelector('#magnify-lens')?.remove();
        clonedPage.style.margin = "0";
        clonedPage.style.padding = "0";
        clonedPage.style.position = "absolute";
        clonedPage.style.top = "0";
        clonedPage.style.left = "0";
        clonedPage.style.width = document.documentElement.scrollWidth + "px";
        clonedPage.style.height = document.documentElement.scrollHeight + "px";
        clonedPage.style.transformOrigin = "top left";
        clonedPage.style.pointerEvents = "none";
        magLens.appendChild(clonedPage);
      }
      createClonedPage();
      function magnifyMove(e) {
        if (!magLens || !clonedPage) return;
        const size = 180,
          zoom = 2.5;
        magLens.style.left = (e.clientX - size / 2) + "px";
        magLens.style.top = (e.clientY - size / 2) + "px";
        const pageX = e.pageX,
          pageY = e.pageY;
        clonedPage.style.transform = `scale(${zoom})`;
        clonedPage.style.left = -(pageX * zoom - size / 2) + "px";
        clonedPage.style.top = -(pageY * zoom - size / 2) + "px";
      }
      document.addEventListener('mousemove', magnifyMove);
    } else {
      if (magLens) magLens.remove();
      magLens = null;
      document.removeEventListener('mousemove', magnifyMove);
    }
    toggleBtnUI(this, magOn);
  };

  // --- LiveTranslate button handler
  const liveTranslateBtn = document.getElementById('a11y-live-translate');
  liveTranslateBtn.onclick = function() {
    alert("LiveTranslate feature not implemented yet.");
    // You can replace the alert with your live translate functionality here.
  };

})();
