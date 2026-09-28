/* ============================================================
   设备检测 · 渲染
   ============================================================ */

const App = {
  r: null,

  init() {
    const saved = localStorage.getItem('detect.theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    this.bind();
    this.r = Detect.run();
    this.renderHero(this.r);
    this.renderGroups(this.r);
    this.renderBrands();
    document.getElementById('uaBox').textContent = this.r.ua;
  },

  bind() {
    document.getElementById('themeBtn').addEventListener('click', () => {
      const now = document.documentElement.getAttribute('data-theme');
      const next = now === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('detect.theme', next);
    });

    document.getElementById('copyUa').addEventListener('click', () => {
      const txt = this.r ? this.r.ua : '';
      this.copy(txt, 'User Agent 已复制');
    });

    document.getElementById('btnDetect').addEventListener('click', () => {
      const v = document.getElementById('uaInput').value.trim();
      if (!v) { this.toast('先粘贴一段 UA'); return; }
      const r = Detect.run(v);
      const box = document.getElementById('customOut');
      box.hidden = false;
      box.innerHTML = `
        <div><b>品牌：</b>${this.esc(r.brand.name)}（${this.esc(r.brand.cn)}）</div>
        <div><b>型号：</b>${this.esc(r.model.code)}${r.model.raw && r.model.raw !== r.model.code ? ' · 代号 ' + this.esc(r.model.raw) : ''}</div>
        <div><b>系统：</b>${this.esc(r.os.name)} ${this.esc(r.os.version)}</div>
        <div><b>浏览器：</b>${this.esc(r.browser.name)} ${this.esc(r.browser.version)}</div>
        ${r.inApp ? `<div><b>来自：</b>${this.esc(r.inApp)} App 内置浏览器</div>` : ''}`;
    });

    document.getElementById('btnReset').addEventListener('click', () => {
      document.getElementById('uaInput').value = '';
      document.getElementById('customOut').hidden = true;
      this.toast('已回到本机检测结果');
    });
  },

  /* ---------- 主结果 ---------- */
  renderHero(r) {
    document.getElementById('hIcon').textContent = r.brand.icon;
    document.getElementById('hBrand').textContent = r.brand.name;
    document.getElementById('hCn').textContent = r.brand.cn;
    document.getElementById('hModel').textContent =
      r.model.code !== '—' ? r.model.code : '未能识别型号';
    document.getElementById('hModelNote').textContent = r.model.note || '';
    document.getElementById('hBadge').textContent =
      r.isMobile ? '检测到移动设备' : '未检测到手机特征';

    // 主色跟随品牌
    const hero = document.getElementById('hero');
    hero.style.setProperty('--primary-container', 'transparent');
    hero.style.background =
      `color-mix(in srgb, ${r.brand.color} 22%, var(--primary-container))`;

    const chips = [
      `${r.os.name} ${r.os.version}`,
      r.browser.name + (r.browser.version ? ' ' + r.browser.version : ''),
      r.screen.css,
      r.inApp ? `${r.inApp} 内置` : null,
    ].filter(Boolean);
    document.getElementById('hChips').innerHTML =
      chips.map(c => `<span class="chip">${this.esc(c)}</span>`).join('');
  },

  /* ---------- 信息分组 ---------- */
  renderGroups(r) {
    const G = [];

    G.push(this.group('系统', [
      ['操作系统', `${r.os.name} ${r.os.version}`.trim()],
      ['厂商系统', this.brandOS(r)],
      ['浏览器', `${r.browser.name} ${r.browser.version}`.trim()],
      ['内核', this.engine(r.browser.name)],
      ['内置浏览器', r.inApp ? `${r.inApp} App` : '否（独立浏览器）'],
      ['平台标识', r.hardware.vendor, 'mono'],
    ]));

    G.push(this.group('屏幕', [
      ['逻辑分辨率', r.screen.css, 'mono'],
      ['物理分辨率', r.screen.physical + ' px', 'mono'],
      ['像素比 DPR', r.screen.dpr + 'x'],
      ['色深', r.screen.colorDepth],
      ['估算 PPI', r.screen.ppi + '（按 6.1 英寸估算）'],
      ['屏幕方向', this.orientName(r.screen.orientation)],
      ['触控', r.screen.touch],
    ]));

    G.push(this.group('硬件', [
      ['CPU 逻辑核心', r.hardware.cores],
      ['设备内存', r.hardware.memory + (r.hardware.memory === '—' ? '' : '（仅部分浏览器可见）')],
      ['指令集', r.hardware.arch],
    ]));

    G.push(this.group('网络与地区', [
      ['网络类型', r.network.type],
      ['下行速度', r.network.downlink],
      ['省流量模式', r.network.saveData],
      ['系统语言', r.locale.lang],
      ['时区', r.locale.tz + (r.locale.offset ? `（UTC${r.locale.offset >= 0 ? '+' : ''}${r.locale.offset}）` : '')],
      ['联网状态', r.locale.online],
    ]));

    // 特性支持
    const F = [
      ['WebGL', r.features.webgl], ['WebGPU', r.features.webgpu],
      ['震动', r.features.vibrate], ['蓝牙', r.features.bluetooth],
      ['NFC', r.features.nfc], ['定位', r.features.geolocation],
      ['摄像头', r.features.camera], ['电量 API', r.features.battery],
      ['离线缓存', r.features.serviceWorker], ['PWA 已安装', r.features.pwa],
    ];
    G.push(`<section class="card">
      <div class="card__hd"><h2>浏览器能力</h2></div>
      <div class="feats">${F.map(([n, v]) =>
        `<span class="feat ${v ? 'on' : ''}">${v ? '✓' : '✕'} ${n}</span>`).join('')}</div>
    </section>`);

    document.getElementById('groups').innerHTML =
      `<div class="grid2">${G.slice(0, 2).join('')}</div>
       <div class="grid2">${G.slice(2, 4).join('')}</div>
       ${G[4]}`;
  },

  group(title, rows) {
    return `<section class="card">
      <div class="card__hd"><h2>${title}</h2></div>
      <div class="rows">${rows.map(([k, v, cls]) =>
        `<div class="row"><div class="row__k">${this.esc(k)}</div>
         <div class="row__v ${cls || ''}">${this.esc(String(v))}</div></div>`).join('')}</div>
    </section>`;
  },

  brandOS(r) {
    try { return r.brand.os ? r.brand.os(r.ua) : '—'; }
    catch (e) { return '—'; }
  },
  engine(name) {
    const map = {
      '微信内置浏览器': 'WebKit / X5', 'QQ 内置浏览器': 'WebKit / X5',
      'UC 浏览器': 'U3 / WebKit', '夸克浏览器': 'Chromium',
    };
    if (map[name]) return map[name];
    if (/Chrome|Edge|Opera/.test(name)) return 'Blink / Chromium';
    if (/Safari/.test(name)) return 'WebKit';
    if (/Firefox/.test(name)) return 'Gecko';
    return '—';
  },
  orientName(o) {
    return ({
      'portrait-primary': '竖屏', 'portrait-secondary': '竖屏（反向）',
      'landscape-primary': '横屏', 'landscape-secondary': '横屏（反向）',
    })[o] || o;
  },

  /* ---------- 品牌列表 ---------- */
  renderBrands() {
    document.getElementById('brandList').innerHTML =
      Detect.BRANDS.map(b =>
        `<span class="bl-item"><span class="dot" style="background:${b.color}"></span>${this.esc(b.name)}</span>`
      ).join('');
  },

  /* ---------- 工具 ---------- */
  copy(text, msg) {
    const done = () => this.toast(msg);
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done).catch(() => this.fallbackCopy(text, done));
    } else {
      this.fallbackCopy(text, done);
    }
  },
  fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); }
    catch (e) { this.toast('复制失败，请手动选择'); }
    ta.remove();
  },

  toastTimer: null,
  toast(msg) {
    const el = document.getElementById('snackbar');
    el.textContent = msg;
    el.classList.add('on');
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => el.classList.remove('on'), 2600);
  },

  esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, m =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  },
};

window.addEventListener('DOMContentLoaded', () => App.init());
