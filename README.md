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

**User Agent 是可以被改写的。** 浏览器里的「桌面版网站」开关、某些隐私插件、部分 App 内置浏览器，都会改 UA。所以这里的结果仅供参考，不能当作唯一依据——页面底部也写了这条提醒。

另外：

- iPhone 型号靠分辨率推测，同分辨率的不同机型无法区分（比如 393×852 可能是 iPhone 15 / 15 Pro / 16）
- 设备内存 `deviceMemory` 只有部分 Chromium 浏览器可见，且只给下限
- 型号库只收录了常见机型，未收录的会显示原始型号代号并标注

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
