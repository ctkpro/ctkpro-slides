# CLAUDE.md — CTK Pro 標案簡報工作庫

> 接手這個 repo 前先讀這份。

## 這個專案是什麼

CTK Pro（竑盛科技）參加**標案評選**用的簡報庫。產出皆為**單檔自足的純前端 HTML 投影片**，
推 GitHub Pages（repo `ctkpro/bid-slides`）或本機檔案放映。

- **對象**：公部門評審／承辦；多用**投影機** → **一律白／淺底**確保清晰。
- **只放 CTK Pro logo**，不放任何**未經確認**的客戶。

## 檔案結構

```
bid-slides/
├── index.html          # root 著陸頁（白底卡片，列出各標案 + 公司介紹）
├── README.md           # 操作 / 部署 / 作圖
├── package.json        # 作圖工具相依
├── .env / .env.example # GEMINI_API_KEY（.env 不入 git）
├── scripts/            # gen-images.mjs（產插圖）、shoot.mjs（截圖驗證）
├── images/ctkpro-logo.png    # 共用 logo
├── ctkpro-intro/index.html   # 公司介紹（風格基準 + 可重用開場）
└── yilan-bids/               # 一標案一資料夾
    ├── index.html           # 投影片本體
    ├── index-wip.html       # 初稿（素材備查）
    └── images/              # 該案截圖 / QR / logos/（客戶 logo 牆）
```

## 🎨 風格標準（所有 deck 對齊）

白底極簡、乾淨留白，但承載標案所需的密度（甘特圖／預算／備詢）。CSS/JS 全內嵌（除 Google Fonts）。

- **背景：暖紙白，不要純白。** 投影機打純白 `#ffffff` 會眩、體感冷硬（尤其搭冷色強調）。全庫一律
  `--bg:#FBFAF7`（暖紙白）、`--ink:#211d1b`（暖近黑，別用 `#1a1a1a` 純黑）。淺底投影機友善的原則不變，只是冷白換暖白。
- **設計 token（`:root`，沿用）**：`--ink:#211d1b`、`--muted:#6b6b6b`、`--soft:#9a9a9a`、`--line:#e6e6e6`、
  `--bg:#FBFAF7`、`--paper:#f7f8fb`；強調色 `--blue:#2f4fb0`（+ `-700/-300/-50` 深淺階）、風險色 `--warn`（少量）。
- **各標案可覆寫主色**（變數名沿用 `--blue*`）。例 `yilan-bids` 改桃紅 `--blue:#D6336C`（`#A61E4D/#F06595/#FFF0F6`）、
  `--paper:#FBF4F0`（暖玫瑰）、`--warn:#9A6700`；覆寫時記得一併改少數**寫死色票**（預算小長條、`#help`、填色卡淺色字）。
  `ctkpro-intro` 改採 CTK Pro 官網／logo 色系：主色 `#e11f27`，並內建深淺色切換。
- **輔助色（圖表用）**：強調色只有一個，深淺同色相容易只剩「亮度差」，甘特圖等多軌時不好分。需要時加**第二色相**：
  `yilan-bids` 用 `--teal:#0E7490`/`#155E75`（與桃紅區隔，白字皆達 AA）。原則：每條色帶**文字統一白色**，別讓底色一深一淺逼文字一下黑一下白。
- **字體**：Noto Sans TC（900/700/500/400）。
- **版型**：`yilan-bids` 用 1280×720 `#stage` 縮放舞台（dense 內容不溢出）；新標案**複製它當骨架**最省事。
- **元件 / 導覽**：元件庫（`.card`/`.compare2`/`.gantt`/`.bud`/`.logo-wall`/`.thanks`/`#qa` 等）與導覽
  （右下可點頁碼 `‹ x / y ›`、← →／空白／Home／End、**點畫面左右各 1/6 才翻頁**（中間 2/3 留給簡報時選字強調，不誤翻頁）、F 全螢幕、Q 備詢、進度條）皆見
  `yilan-bids/index.html`，照搬即可。新增一頁＝加一個 `.slide`，頁碼自動算。
- **DEMO 影片（現場示範，不切畫面）**：見 `yilan-bids` P4／P5。影片放標案資料夾根目錄、**檔名不要有空白**（`demo0.mp4`…）、靜音 `.mp4`。
  頁面放 `<button class="demo-btn" onclick="playDemos(['demo0.mp4'])">`；連播多段傳陣列 `playDemos(['demo1.mp4','demo2.mp4'])`，前段 `ended` 自動接下段（尺寸不同沒關係，`object-fit:contain` 各自滿版）。
  播放層 `#vplayer`（`position:fixed;inset:0` 蓋滿畫面）＋ `playDemos()`/`closeVideo()` 已在 script 內：靜音自動播、空白暫停、Esc／點黑邊關閉、播放中擋翻頁。複製骨架一起帶走。
- **置圖**：截圖丟 `images/`，**等比縮放**到寬約 1100px；命名對齊 deck 內既有 `<img src>`（如 `p06-tap.png`/`p07-fnac.png`），`onerror` 自動 fallback。

## 新標案流程

1. 建 `<案名>-bids/`（含 `images/`），複製 `yilan-bids/index.html` 改 `<title>`／封面／各頁。
2. 配圖放 `images/`；要生成的插圖 `node scripts/gen-images.mjs --out <案名>/images`。
3. 客戶 logo 放 `images/logos/<brand>.png`（缺圖自動 fallback 成文字字標）；**放上前先確認客戶屬實**。
4. root `index.html`「標案簡報」加一張卡片連到該資料夾。
5. 驗證：瀏覽器翻一遍，或 `node scripts/shoot.mjs <案名>`。

## 慣例

- 一律**繁體中文（台灣）**、白／淺底。
- 金額／證號／日期等**以標案文件為準**，勿臆造。
- 不要把 `node_modules/`、`.env` 進 git（已在 `.gitignore`）。
- **commit / push 只在被要求時做**。
