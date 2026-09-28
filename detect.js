/* ============================================================
   设备检测 · 品牌 / 型号 / 系统 / 浏览器 / 硬件
   ------------------------------------------------------------
   数据来源：User Agent + 屏幕参数 + navigator API
   全部在本机计算，不上传任何信息。
   ============================================================ */

const Detect = {

  /* ---------- 品牌规则表（按顺序匹配，先命中先得） ---------- */
  BRANDS: [
    {
      id: 'apple', name: 'Apple', cn: '苹果', color: '#555555', icon: '',
      test: ua => /iPhone|iPad|iPod/i.test(ua),
      os: () => 'iOS / iPadOS',
    },
    {
      id: 'huawei', name: 'HUAWEI', cn: '华为', color: '#CF0A2C', icon: '🌸',
      test: ua => /HUAWEI|HuaweiBrowser|HarmonyOS|\bELS-|\bTAS-|\bJEF-|\bLIO-|\bANA-|\bNOH-|\bALN-|\bBAL-|\bFOA-|\bBRR-|\bCET-|\bDBY-|\bGLA-|\bJAD-|\bLIO-|\bMAR-|\bOCE-|\bTET-|\bVIE-|\bWKG-/i.test(ua) && !/Honor|HONOR/i.test(ua),
      os: ua => /HarmonyOS/i.test(ua) ? 'HarmonyOS' : 'Android（EMUI）',
    },
    {
      id: 'honor', name: 'HONOR', cn: '荣耀', color: '#1E5EFF', icon: '🛡️',
      test: ua => /Honor|HONOR/i.test(ua),
      os: ua => /HarmonyOS/i.test(ua) ? 'HarmonyOS（MagicOS）' : 'Android（MagicOS）',
    },
    {
      id: 'xiaomi', name: 'Xiaomi', cn: '小米', color: '#FF6900', icon: '🍊',
      test: ua => /Xiaomi|MIUI|Redmi|RedmiK|POCO|\bMI\s|MiuiBrowser/i.test(ua),
      os: () => 'Android（MIUI / HyperOS）',
    },
    /* 一加必须排在 OPPO 之前：一加机型码（CPH2449/NE2210 等）同样含 CPH 前缀，
       若让 OPPO 先匹配，一加会被误判成 OPPO。 */
    {
      id: 'oneplus', name: 'OnePlus', cn: '一加', color: '#EB0028', icon: '1️⃣',
      test: ua => /OnePlus|OxygenOS|\bNE\d{4}|\bIN\d{4}|\bKB\d{4}|\bLE\d{4}|\bCPH24\d\d|\bPHB\d{4}/i.test(ua),
      os: () => 'Android（OxygenOS / ColorOS）',
    },
    {
      id: 'oppo', name: 'OPPO', cn: 'OPPO', color: '#00783E', icon: '🟩',
      test: ua => /OPPO|ColorOS|\bCPH\d|\bPH[KPE]\d|\bPGB\d|\bPKT\d|\bPJD\d/i.test(ua) && !/realme|RMX|OnePlus/i.test(ua),
      os: () => 'Android（ColorOS）',
    },
    {
      id: 'realme', name: 'realme', cn: '真我', color: '#FFC915', icon: '🟨',
      test: ua => /realme|\bRMX\d/i.test(ua),
      os: () => 'Android（realme UI）',
    },
    {
      id: 'vivo', name: 'vivo', cn: 'vivo', color: '#415FFF', icon: '🟦',
      test: ua => /vivo|iQOO|IQOO|\bV\d{4}[A-Z]?\b|\bPD\d{4}\b|Funtouch|OriginOS/i.test(ua),
      os: () => 'Android（OriginOS / Funtouch）',
    },
    {
      id: 'samsung', name: 'SAMSUNG', cn: '三星', color: '#1428A0', icon: '🔷',
      test: ua => /Samsung|SAMSUNG|\bSM-[A-Z]\d|SamsungBrowser/i.test(ua),
      os: () => 'Android（One UI）',
    },
    {
      id: 'meizu', name: 'Meizu', cn: '魅族', color: '#00A0FF', icon: '🔵',
      test: ua => /Meizu|\bM\d{4}[A-Z]?\b/i.test(ua) && /Meizu|Flyme|MZ-/i.test(ua) || /Flyme/i.test(ua),
      os: () => 'Android（Flyme）',
    },
    {
      id: 'nubia', name: 'nubia / 红魔', cn: '努比亚', color: '#E60012', icon: '🔴',
      test: ua => /Nubia|nubia|RedMagic|\bZTE\b|\bNX\d{3}[A-Z]?/i.test(ua),
      os: () => 'Android',
    },
    {
      id: 'motorola', name: 'Motorola', cn: '摩托罗拉', color: '#5C92C2', icon: '🅼',
      test: ua => /Motorola|\bmoto\b|\bXT\d{4}\b/i.test(ua),
      os: () => 'Android',
    },
    {
      id: 'sony', name: 'SONY', cn: '索尼', color: '#000000', icon: '🎮',
      test: ua => /Sony|Xperia|\bSO-\d|\bXQ-[A-Z]{2}\d{2}\b|\bSOG\d{2}\b/i.test(ua),
      os: () => 'Android',
    },
    {
      id: 'google', name: 'Google Pixel', cn: '谷歌', color: '#4285F4', icon: '🅶',
      test: ua => /\bPixel\b/i.test(ua),
      os: () => 'Android（原生）',
    },
    {
      id: 'tecno', name: 'TECNO / itel / Infinix', cn: '传音', color: '#00A0DF', icon: '🌍',
      test: ua => /TECNO|Itel|Infinix/i.test(ua),
      os: () => 'Android',
    },
    {
      id: 'asus', name: 'ASUS', cn: '华硕', color: '#00539B', icon: '🎯',
      test: ua => /ASUS|ROG Phone|Zenfone|ZenFone/i.test(ua),
      os: () => 'Android',
    },
    {
      id: 'nokia', name: 'Nokia', cn: '诺基亚', color: '#124191', icon: '📟',
      test: ua => /Nokia|\bTA-\d{4}\b/i.test(ua),
      os: () => 'Android',
    },
    {
      id: 'lg', name: 'LG', cn: 'LG', color: '#A50034', icon: '🅻',
      test: ua => /\bLG-[A-Z]?\d|\bLM-[A-Z]?\d/i.test(ua),
      os: () => 'Android',
    },
    {
      id: 'htc', name: 'HTC', cn: 'HTC', color: '#0F9EDE', icon: '🅷',
      test: ua => /\bHTC\b/i.test(ua),
      os: () => 'Android',
    },
    {
      id: 'lenovo', name: 'Lenovo', cn: '联想', color: '#E2231A', icon: '🅻',
      test: ua => /Lenovo|\bTB-\d|\bL\d{5}\b/i.test(ua),
      os: () => 'Android',
    },
  ],

  /* ---------- 型号库：[正则, 机型名, 品牌 id]
     第三列用于「品牌未命中时按型号码反推品牌」——
     不少国产 ROM 的 UA 里只留型号码、不带品牌字样。 ---------- */
  MODELS: [
    // 三星
    [/^SM-S938/, 'Galaxy S25 Ultra', 'samsung'], [/^SM-S936/, 'Galaxy S25+', 'samsung'],
    [/^SM-S931/, 'Galaxy S25', 'samsung'],
    [/^SM-S928/, 'Galaxy S24 Ultra', 'samsung'], [/^SM-S926/, 'Galaxy S24+', 'samsung'],
    [/^SM-S921/, 'Galaxy S24', 'samsung'],
    [/^SM-S918/, 'Galaxy S23 Ultra', 'samsung'], [/^SM-S916/, 'Galaxy S23+', 'samsung'],
    [/^SM-S911/, 'Galaxy S23', 'samsung'],
    [/^SM-S908/, 'Galaxy S22 Ultra', 'samsung'], [/^SM-S906/, 'Galaxy S22+', 'samsung'],
    [/^SM-S901/, 'Galaxy S22', 'samsung'],
    [/^SM-G998/, 'Galaxy S21 Ultra 5G', 'samsung'], [/^SM-G996/, 'Galaxy S21+', 'samsung'],
    [/^SM-G991/, 'Galaxy S21', 'samsung'],
    [/^SM-F95[68]/, 'Galaxy Z Fold 6', 'samsung'], [/^SM-F946/, 'Galaxy Z Fold 5', 'samsung'],
    [/^SM-F936/, 'Galaxy Z Fold 4', 'samsung'],
    [/^SM-F74[13]/, 'Galaxy Z Flip 6', 'samsung'], [/^SM-F731/, 'Galaxy Z Flip 5', 'samsung'],
    [/^SM-A\d{3}/, 'Galaxy A 系列', 'samsung'],
    [/^SM-[SG]/, 'Galaxy 系列', 'samsung'],
    // 小米 / Redmi（内部型号码）
    [/^2211133C/, 'Xiaomi 13', 'xiaomi'], [/^2311DRK48/, 'Xiaomi 14', 'xiaomi'],
    [/^24031PN0D/, 'Xiaomi 14 Ultra', 'xiaomi'], [/^23116PN5B/, 'Xiaomi 13 Ultra', 'xiaomi'],
    [/^23127PN0C/, 'Xiaomi 13T / 13T Pro', 'xiaomi'], [/^22081212C/, 'Xiaomi 12T Pro', 'xiaomi'],
    [/^2107113S/, 'Xiaomi 11T Pro', 'xiaomi'], [/^M2102K1/, 'Mi 11', 'xiaomi'],
    [/^22111317C/, 'Redmi Note 12 Pro', 'xiaomi'],
    [/^\d{8}[A-Z]{0,2}I/, 'Redmi 机型', 'xiaomi'],
    [/^\d{8}[A-Z]{0,2}C/, 'Xiaomi 机型', 'xiaomi'],
    // 华为
    [/^ELS-AN/, 'P50 Pro', 'huawei'], [/^JEF-AN/, 'P50 Pocket', 'huawei'],
    [/^TAS-AN/, 'Mate 50 / 60', 'huawei'], [/^LIO-AL/, 'Mate 30 Pro', 'huawei'],
    [/^ANA-AN/, 'P40 系列', 'huawei'], [/^NOH-AN/, 'Mate 40 Pro', 'huawei'],
    [/^ALN-AL/, 'Mate 60 Pro', 'huawei'], [/^BAL-AL/, 'Mate X3', 'huawei'],
    [/^FOA-AL/, 'P60', 'huawei'], [/^VIE-AL/, 'Mate 40', 'huawei'], [/^OCE-AN/, 'P50', 'huawei'],
    // OPPO / 一加 / realme
    [/^PH[KPE]\d{3}/, 'Find X 系列', 'oppo'], [/^PGB\d{3}/, 'Find N 系列', 'oppo'],
    [/^CPH24\d\d/, 'OnePlus 机型', 'oneplus'], [/^CPH\d{4}/, 'OPPO 机型', 'oppo'],
    [/^RMX\d{4}/, 'realme 机型', 'realme'],
    // vivo / iQOO
    [/^V\d{4}[A-Z]/, 'vivo / iQOO 机型', 'vivo'], [/^PD\d{4}/, 'vivo 机型', 'vivo'],
    // 努比亚 / 红魔
    [/^NX\d{3}[A-Z]?/, 'nubia / 红魔机型', 'nubia'],
    // 索尼
    [/^XQ-/, 'Xperia 机型', 'sony'], [/^SO-\d/, 'Xperia 机型', 'sony'],
  ],

  /* ---------- iPhone 型号推测（按 CSS 逻辑分辨率） ---------- */
  IPHONES: [
    ['320,480', 'iPhone 4 / 4s 或更老'],
    ['320,568', 'iPhone 5 / 5s / SE (1代)'],
    ['375,667', 'iPhone 6 / 7 / 8 / SE (2/3代)'],
    ['414,736', 'iPhone 6/7/8 Plus'],
    ['375,812', 'iPhone X / XS / 11 Pro'],
    ['414,896', 'iPhone XR / XS Max / 11 / 11 Pro Max'],
    ['360,780', 'iPhone 12 mini / 13 mini'],
    ['390,844', 'iPhone 12 / 12 Pro / 13 / 13 Pro / 14'],
    ['428,926', 'iPhone 12 Pro Max / 13 Pro Max / 14 Plus'],
    ['393,852', 'iPhone 15 / 15 Pro / 16'],
    ['430,932', 'iPhone 15 Pro Max / 15 Plus / 16 Plus / 16 Pro Max'],
    ['402,874', 'iPhone 16 Pro'],
    ['440,956', 'iPhone 16 Pro Max'],
    ['768,1024', 'iPad / iPad mini / Air'],
    ['810,1080', 'iPad (10.2") / Air'],
    ['834,1112', 'iPad Pro 10.5" / Air'],
    ['1024,1366', 'iPad Pro 12.9"'],
    ['834,1194', 'iPad Pro 11"'],
    ['1032,1376', 'iPad Pro 12.9"'],
  ],

  /* ============================================================
     主入口
     ============================================================ */
  run(uaOverride) {
    const ua = uaOverride || navigator.userAgent;
    const nav = navigator;

    const brand = this.detectBrand(ua);
    const model = this.detectModel(ua, brand);
    const os = this.detectOS(ua);
    const browser = this.detectBrowser(ua);
    const screenInfo = this.detectScreen();
    const hardware = this.detectHardware(ua);
    const isMobile = this.isMobile(ua);

    return {
      ua,
      isMobile,
      brand,
      model,
      os,
      browser,
      screen: screenInfo,
      hardware,
      network: this.detectNetwork(),
      locale: this.detectLocale(),
      features: this.detectFeatures(),
      inApp: this.detectInApp(ua),
    };
  },

  /* ---------- 品牌 ---------- */
  detectBrand(ua) {
    for (const b of this.BRANDS) {
      try { if (b.test(ua)) return b; } catch (e) { /* 规则异常则跳过 */ }
    }
    /* 兜底：国产 ROM 常常只留型号码、不带品牌字样，
       这时用型号库反推品牌（MODELS 的第三列就是品牌 id）。 */
    const m = ua.match(/Android\s*[\d.]+;\s*([^;)]+)/);
    if (m) {
      const code = m[1].trim().replace(/\s*Build\/.*$/i, '').trim();
      for (const [re, , bid] of this.MODELS) {
        if (re.test(code)) {
          const b = this.BRANDS.find(x => x.id === bid);
          if (b) return b;
        }
      }
    }
    // 兜底：能从 Android + 机型码看出是安卓机，但品牌未收录
    if (/Android/i.test(ua) && /Mobile|Mobile Safari/i.test(ua)) {
      return { id: 'unknown', name: '未知安卓机型', cn: '未收录品牌', color: '#8A8A8A', icon: '📱', os: () => 'Android' };
    }
    if (/Android/i.test(ua)) {
      return { id: 'android', name: 'Android 设备', cn: '安卓（可能非手机）', color: '#3DDC84', icon: '🤖', os: () => 'Android' };
    }
    if (/Windows|Macintosh|Linux|X11/i.test(ua)) {
      return { id: 'pc', name: '电脑 / 平板', cn: '非手机设备', color: '#6B6B6B', icon: '💻', os: () => '桌面系统' };
    }
    return { id: 'unknown', name: '无法识别', cn: '未知设备', color: '#8A8A8A', icon: '❓', os: () => '未知' };
  },

  /* ---------- 型号 ---------- */
  detectModel(ua, brand) {
    // 1) UA 里的 Android 机型码：Android 13; XXXXXX)
    let code = '';
    const m = ua.match(/Android\s*[\d.]+;\s*([^;)]+)/);
    if (m) code = m[1].trim();
    // Linux; U; Android ... 变体
    if (!code) {
      const m2 = ua.match(/Linux;\s*([A-Za-z0-9][A-Za-z0-9\-_]{2,})\s*\)/);
      if (m2) code = m2[1];
    }
    // 型号码后面常跟着 "Build/xxxx" 或 "wv)"，去掉只留代号本身
    code = code.replace(/\s*Build\/.*$/i, '').replace(/\s*\).*$/, '').trim();
    // 2) iPhone：用分辨率推测
    if (brand && brand.id === 'apple') {
      const key = `${screen.width},${screen.height}`;
      const alt = `${Math.min(screen.width, screen.height)},${Math.max(screen.width, screen.height)}`;
      const hit = this.IPHONES.find(x => x[0] === key || x[0] === alt);
      const iosV = (ua.match(/OS\s+(\d+)_/) || [])[1];
      return {
        code: hit ? hit[1] : 'iPhone / iPad',
        raw: '',
        guessed: true,
        note: hit ? '根据屏幕分辨率推测' : 'UA 中不含机型，可参考屏幕尺寸',
        iosMajor: iosV || null,
      };
    }
    // 3) 品牌内建型号库匹配
    if (code) {
      for (const [re, name] of this.MODELS) {
        if (re.test(code)) return { code: name, raw: code, guessed: false };
      }
      // 品牌匹配上的话，型号码本身就是有用的信息
      return { code, raw: code, guessed: false, note: '型号库未收录，显示原始代号' };
    }
    return { code: '—', raw: '', guessed: true };
  },

  /* ---------- 操作系统 ---------- */
  detectOS(ua) {
    const out = { name: '未知', version: '' };
    let m;
    if ((m = ua.match(/Android\s*([\d.]+)/))) {
      out.name = 'Android'; out.version = m[1];
      if (/HarmonyOS/i.test(ua)) {
        out.name = 'HarmonyOS';
        const h = ua.match(/HarmonyOS[;\s]*([\d.]+)/i);
        out.version = h ? h[1] : (m[1] ? '基于 Android ' + m[1] : '');
      }
      return out;
    }
    if ((m = ua.match(/OS\s+(\d+)[_.](\d+)(?:[_.](\d+))?/)) && /iPhone|iPad|iPod/i.test(ua)) {
      out.name = /iPad/i.test(ua) ? 'iPadOS' : 'iOS';
      out.version = `${m[1]}.${m[2]}${m[3] ? '.' + m[3] : ''}`;
      return out;
    }
    if ((m = ua.match(/Mac OS X\s*([\d_.]+)/))) {
      out.name = 'macOS'; out.version = m[1].replace(/_/g, '.');
      return out;
    }
    if (/Windows NT 10/.test(ua)) { out.name = 'Windows 10 / 11'; return out; }
    if (/Windows/.test(ua)) { out.name = 'Windows'; return out; }
    if (/Linux/.test(ua)) { out.name = 'Linux'; return out; }
    return out;
  },

  /* ---------- 浏览器 ---------- */
  detectBrowser(ua) {
    const list = [
      [/MicroMessenger\/([\d.]+)/, '微信内置浏览器'],
      [/QQ\/([\d.]+)/, 'QQ 内置浏览器'],
      [/Weibo/, '微博内置浏览器'],
      [/Alipay/, '支付宝内置浏览器'],
      [/DingTalk/, '钉钉内置浏览器'],
      [/Quark\/([\d.]+)/, '夸克浏览器'],
      [/UCBrowser\/([\d.]+)/, 'UC 浏览器'],
      [/MZBrowser|Flyme.*Browser/, '魅族浏览器'],
      [/HuaweiBrowser\/([\d.]+)/, '华为浏览器'],
      [/MiuiBrowser\/([\d.]+)/, '小米浏览器'],
      [/HeyTapBrowser\/([\d.]+)/, 'OPPO 浏览器'],
      [/VivoBrowser\/([\d.]+)/, 'vivo 浏览器'],
      [/SamsungBrowser\/([\d.]+)/, '三星浏览器'],
      [/Edg(?:e|A|iOS)?\/([\d.]+)/, 'Edge'],
      [/OPR\/([\d.]+)/, 'Opera'],
      [/Firefox\/([\d.]+)/, 'Firefox'],
      [/Chrome\/([\d.]+)/, 'Chrome'],
      [/Version\/([\d.]+).*Safari/, 'Safari'],
    ];
    for (const [re, name] of list) {
      const m = ua.match(re);
      if (m) return { name, version: m[1] || '', full: m[0] };
    }
    return { name: '未知浏览器', version: '', full: '' };
  },

  /* ---------- 是否 App 内置 ---------- */
  detectInApp(ua) {
    const map = [
      [/MicroMessenger/, '微信'],
      [/QQ\//, 'QQ'],
      [/Weibo/, '微博'],
      [/Alipay/, '支付宝'],
      [/DingTalk/, '钉钉'],
      [/BiliApp|bilibili/, '哔哩哔哩'],
      [/Toutiao|NewsArticle/, '今日头条'],
      [/BaiduBoxapp/, '百度 App'],
      [/Taobao|AliApp/, '淘宝'],
      [/JDApp/, '京东'],
    ];
    for (const [re, name] of map) if (re.test(ua)) return name;
    return null;
  },

  /* ---------- 是否手机 ---------- */
  isMobile(ua) {
    return /Mobile|Android|iPhone|iPad|iPod|Windows Phone|HarmonyOS/i.test(ua)
      || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua) === false && screen.width < 900);
  },

  /* ---------- 屏幕 ---------- */
  detectScreen() {
    const s = screen;
    const dpr = window.devicePixelRatio || 1;
    const w = s.width, h = s.height;
    const pw = Math.round(w * dpr), ph = Math.round(h * dpr);
    return {
      css: `${w} × ${h}`,
      physical: `${pw} × ${ph}`,
      dpr: dpr.toFixed(2).replace(/\.?0+$/, ''),
      colorDepth: s.colorDepth ? s.colorDepth + ' bit' : '—',
      // 粗略物理尺寸：按常见 DPR 与 CSS 尺寸推算，仅供玩笑式参考
      ppi: this.estimatePPI(w, h, dpr),
      orientation: (screen.orientation && screen.orientation.type)
        || (h > w ? 'portrait-primary' : 'landscape-primary'),
      touch: navigator.maxTouchPoints > 0 ? `支持（最多 ${navigator.maxTouchPoints} 点）` : '不支持',
    };
  },

  estimatePPI(w, h, dpr) {
    // 没有真实物理尺寸，只能按常见机型比例粗估，标注为估算
    const diagPx = Math.sqrt((w * dpr) ** 2 + (h * dpr) ** 2);
    const diagIn = 6.1; // 取主流手机 6.1 英寸
    return Math.round(diagPx / diagIn);
  },

  /* ---------- 硬件 ---------- */
  detectHardware(ua) {
    const cores = navigator.hardwareConcurrency;
    const mem = navigator.deviceMemory;
    return {
      cores: cores ? `${cores} 核（逻辑）` : '—',
      memory: mem ? `${mem} GB 以上` : '—',
      arch: this.detectArch(ua),
      vendor: (navigator.platform || '—'),
    };
  },
  detectArch(ua) {
    if (/arm64|aarch64/i.test(ua)) return 'ARM64';
    if (/\barmv|armeabi/i.test(ua)) return 'ARM32';
    if (/x86_64|x64|WOW64/i.test(ua)) return 'x86-64';
    if (/i686|x86\b/i.test(ua)) return 'x86';
    return '—';
  },

  /* ---------- 网络 ---------- */
  detectNetwork() {
    const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!c) return { type: '—', downlink: '—', saveData: '—' };
    const map = {
      'slow-2g': '2G（慢）', '2g': '2G', '3g': '3G', '4g': '4G', '5g': '5G',
      wifi: 'Wi-Fi', ethernet: '有线', bluetooth: '蓝牙', cellular: '蜂窝网络', none: '无网络',
    };
    return {
      type: map[c.effectiveType] || map[c.type] || c.effectiveType || '—',
      downlink: c.downlink ? `${c.downlink} Mb/s` : '—',
      saveData: c.saveData ? '已开启' : '未开启',
    };
  },

  /* ---------- 地区与语言 ---------- */
  detectLocale() {
    let tz = '—';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '—'; } catch (e) { }
    return {
      lang: navigator.language || '—',
      langs: (navigator.languages || []).join(', ') || '—',
      tz,
      offset: -new Date().getTimezoneOffset() / 60,
      online: navigator.onLine ? '在线' : '离线',
    };
  },

  /* ---------- 特性支持 ---------- */
  detectFeatures() {
    const has = (k) => k in window;
    return {
      webgl: (() => {
        try {
          const c = document.createElement('canvas');
          return !!(c.getContext('webgl') || c.getContext('experimental-webgl'));
        } catch (e) { return false; }
      })(),
      webgpu: has('WebGPU') || has('gpu'),
      serviceWorker: has('ServiceWorkerRegistration') || 'serviceWorker' in navigator,
      vibrate: 'vibrate' in navigator,
      bluetooth: has('Bluetooth') || 'bluetooth' in navigator,
      usb: 'usb' in navigator,
      nfc: 'nfc' in navigator,
      geolocation: 'geolocation' in navigator,
      camera: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      battery: 'getBattery' in navigator,
      pwa: window.matchMedia('(display-mode: standalone)').matches,
    };
  },
};
