# 你的手机是什么品牌？

一个纯前端的设备检测页面。打开就知道——你的手机品牌、型号、系统版本、屏幕和硬件参数。

## 在线访问

https://excuse-2580.github.io/phone-detect/

## 检测什么

| 分组 | 内容 |
|---|---|
| **品牌** | 20 个品牌规则，按 User Agent 匹配 |
| **型号** | 型号库映射（如 `SM-S928B` → Galaxy S24 Ultra）；iPhone 按屏幕分辨率推测 |
| **系统** | Android / iOS / iPadOS / HarmonyOS / Windows / macOS，含版本号与厂商 UI |
| **浏览器** | Chrome / Safari / Edge / Firefox / UC / 夸克 / 各厂商浏览器，及内核 |
| **屏幕** | 逻辑与物理分辨率、DPR、色深、估算 PPI、方向、触控点数 |
| **硬件** | CPU 逻辑核心数、设备内存、指令集 |
| **网络** | 网络类型、下行速度、省流量模式、时区、语言 |
| **能力** | WebGL / WebGPU / 蓝牙 / NFC / 定位 / 摄像头 / PWA 等 10 项 |

## 三重识别逻辑

第一层按品牌特征词匹配；第二层用型号库反推品牌（很多国产 ROM 的 UA 里只有型号码、不带品牌字样，比如小米在微信内置浏览器里就是这样）；第三层按屏幕分辨率推测 iPhone 机型（UA 里从不写具体是哪代 iPhone）。

**华为与荣耀的区分**最麻烦——两者机型码格式完全一样（都是 `XXX-AN00`）。这里靠 `Build/` 字段的厂商前缀来定：`Build/HUAWEIxxx` 是华为，`Build/HONORxxx` 是荣耀；前缀缺失时再查荣耀独立的机型码库（LOG / BVL / NLA / DNN / AMG / JLH / ALI / DNY…）。荣耀规则排在华为之前，避免荣耀被误判成华为。

## 支持粘贴 UA

页面底部可以粘贴任意 User Agent，看看别的设备长什么样——比如把朋友发来的 UA 扔进去。

## 实测识别结果

22 组真实 UA 样本，识别 **22/22**：

```
iPhone 15 Pro / 14 Pro Max · 华为 Mate 60 Pro / P50 Pro(HarmonyOS)
小米 13 · Redmi Note 12 · OPPO Find X6 · realme GT
vivo X100 · iQOO 12 · 三星 S24 Ultra / S23 · 一加 11
荣耀 Magic6 · 魅族 21 · 红魔 9 Pro · Pixel 8 · 索尼 Xperia
摩托罗拉 · 微信内置(小米 13) · 桌面 Chrome · Mac Safari
```

## 已知边界

**User Agent 是可以被改写的**，所以结果仅供参考，不能当作唯一依据。常见的三种情况：

### 1. ROM 的 UA 隐私保护（荣耀最常见）

荣耀 MagicOS 有 UA 脱敏机制，会把设备型号替换成占位符。**最典型的表现就是型号变成一个字母 `K`**：

```
正常：  (Linux; Android 15; LOG-AN00 Build/HONORLGN-AN00; wv)
脱敏：  (Linux; Android 10; K)
```

这时页面会显示「型号已被系统隐藏」并在系统卡片标注「型号脱敏：是」，而不是冷冰冰的「未识别」——因为**不是没认出来，是系统主动抹掉了**。想看到真实型号，可以关掉该隐私开关，或换用系统浏览器打开。

### 2. 浏览器改 UA

「桌面版网站」开关、隐私插件、部分 App 内置浏览器都会改写 UA。

### 3. 其他限制

- iPhone 型号靠分辨率推测，同分辨率的不同机型无法区分（393×852 可能是 iPhone 15 / 15 Pro / 16）
- 设备内存 `deviceMemory` 只有部分 Chromium 浏览器可见，且只给下限
- 型号库只收录常见机型，未收录的显示原始型号代号并标注

## 隐私

**所有计算都在浏览器里完成，没有任何网络请求，不上传任何数据。** 页面只读浏览器主动暴露的信息（UA、屏幕参数、navigator API），不请求定位、通讯录、相册等任何权限。

## 技术

```
index.html   页面结构
styles.css   Material Design 3 配色与组件
detect.js    品牌规则库 + 型号库 + 各项检测逻辑
app.js       渲染与交互
```

零依赖、零构建。双击 `index.html` 也能跑。
