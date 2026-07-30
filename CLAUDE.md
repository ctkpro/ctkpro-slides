# CLAUDE.md — CTK Pro 標案簡報工作庫

> 接手這個 repo 前先讀這份。

## 這個專案是什麼

CTK Pro（竑盛科技）參加**標案評選**用的簡報庫。產出皆為**單檔自足的純前端 HTML 投影片**，
推 GitHub Pages（repo `ctkpro/bid-slides`）或本機檔案放映。

- **對象**：公部門評審／承辦；多用**投影機** → **一律白／淺底**確保清晰。
- **只放 CTK Pro logo**，不放任何**未經確認**的客戶。

## 檔案結構

投影片**依用途分三類**，每類一個大資料夾；一場簡報＝一個子資料夾（自帶 `images/`）。

```
bid-slides/
├── index.html          # root 著陸頁（白底卡片，分三區列出所有簡報）
├── README.md           # 操作 / 部署 / 作圖
├── package.json        # 作圖工具相依
├── .env / .env.example # GEMINI_API_KEY（.env 不入 git）
├── guides/             # 跨簡報共用準則（先讀「簡報敘事角度與用詞原則.md」）
├── scripts/            # gen-images.mjs（產插圖）、shoot.mjs（截圖驗證）
├── images/ctkpro-logo.png    # 共用 logo
│
├── bids/                      # ① 標案（對公部門評選）
│   ├── yilan-bids/           #   一標案一資料夾
│   │   ├── index.html       #     投影片本體（版型骨架基準）
│   │   ├── index-wip.html   #     初稿（素材備查）
│   │   ├── 備詢準備-*.md     #     本案專屬備詢（引用 ../qa_kbs/）
│   │   └── images/          #     該案截圖 / QR / logos/（客戶 logo 牆）
│   ├── 桃原基會-bids/
│   └── qa_kbs/               #   通用備詢知識庫（跨標案共用，被各案引用）
│
├── sales-pitch/              # ② 對外（給客戶／新認識的企業）
│   ├── ctkpro-intro/         #   公司介紹（風格基準 + 可重用開場）
│   └── for-design-company/   #   給設計公司的合作提案
│       ├── index-claude-v2.html  #  A 版：現場可點示範（互動元件基準）
│       ├── index-v2.html         #  B 版：靜態排版
│       └── *.md                  #  V3 大綱與研究底稿（以 V3 為準）
│
└── internal-talks/           # ③ 對內（同事／全員發表）
    ├── 2026q3-all-hands/     #   季度全員發表
    └── prompt-context-harness-engineering/   # Prompt·Context·Harness 深化版
```

> `bids/qa_kbs/` 與各標案是**同層**，所以標案備詢檔用 `../qa_kbs/...` 相對路徑引用；新增標案時沿用這個相對深度。

## 🎨 風格標準（所有 deck 對齊）

白底極簡、乾淨留白，但承載標案所需的密度（甘特圖／預算／備詢）。CSS/JS 全內嵌（除 Google Fonts）。
**動筆前先讀 `guides/簡報敘事角度與用詞原則.md`**（誰在說話、說給誰聽、CTA 語氣、版面原則）。

- **背景：暖紙白，不要純白。** 投影機打純白 `#ffffff` 會眩、體感冷硬（尤其搭冷色強調）。全庫一律
  `--bg:#FBFAF7`（暖紙白）、`--ink:#211d1b`（暖近黑，別用 `#1a1a1a` 純黑）。淺底投影機友善的原則不變，只是冷白換暖白。
- **設計 token（`:root`，沿用）**：`--ink:#211d1b`、`--muted:#6b6b6b`、`--soft:#9a9a9a`、`--line:#e6e6e6`、
  `--bg:#FBFAF7`、`--paper:#f7f8fb`；強調色 `--blue:#2f4fb0`（+ `-700/-300/-50` 深淺階）、風險色 `--warn`（少量）。
- **各標案可覆寫主色**（變數名沿用 `--blue*`）。例 `bids/yilan-bids` 改桃紅 `--blue:#D6336C`（`#A61E4D/#F06595/#FFF0F6`）、
  `--paper:#FBF4F0`（暖玫瑰）、`--warn:#9A6700`；覆寫時記得一併改少數**寫死色票**（預算小長條、`#help`、填色卡淺色字）。
  `sales-pitch/ctkpro-intro` 改採 CTK Pro 官網／logo 色系：主色 `#e11f27`，並內建深淺色切換。
- **輔助色（圖表用）**：強調色只有一個，深淺同色相容易只剩「亮度差」，甘特圖等多軌時不好分。需要時加**第二色相**：
  `bids/yilan-bids` 用 `--teal:#0E7490`/`#155E75`（與桃紅區隔，白字皆達 AA）。原則：每條色帶**文字統一白色**，別讓底色一深一淺逼文字一下黑一下白。
- **字體**：Noto Sans TC（900/700/500/400）。
- **右側留白**：內容不要頂到右邊。標案密集頁 `padding-right:182px`（見 `Bid_Writing/cases/*/slides`）、對外簡報 `148px`（約 10–12%）。
  右上角 logo 對齊內容右緣（`right` 與 `padding-right` 同值），不要單獨落在留白裡。
- **對照表別整欄填色**：雙方對照（例「設計公司 vs CTK Pro」）用 `.card.fill` 整塊填強調色，會讀成上下位關係。
  改用淡底 `--brand-50` ＋ 左側 5px 色邊，兩欄維持同一重量。整塊填色留給單一主張的宣示卡。
- **版型**：`bids/yilan-bids` 用 1280×720 `#stage` 縮放舞台（dense 內容不溢出）；新標案**複製它當骨架**最省事。
- **版面節奏**：聽眾有設計背景時（設計公司、品牌顧問），別每頁都是「kicker＋大標＋等寬卡片」。
  `sales-pitch/for-design-company/index-claude-v2.html` 有七種可抄的骨架：不對齊拼貼＋背景巨大淡字、左右流程、時間軸、整併表格、大字引言、深色證照塊、瀏覽器外框示範區。
- **元件 / 導覽**：元件庫（`.card`/`.compare2`/`.gantt`/`.bud`/`.logo-wall`/`.thanks`/`#qa` 等）與導覽
  （右下可點頁碼 `‹ x / y ›`、← →／空白／Home／End、**點畫面左右各 1/6 才翻頁**（中間 2/3 留給簡報時選字強調，不誤翻頁）、F 全螢幕、Q 備詢、進度條）皆見
  `bids/yilan-bids/index.html`，照搬即可。新增一頁＝加一個 `.slide`，頁碼自動算。
- **DEMO 影片（現場示範，不切畫面）**：見 `bids/yilan-bids` P4／P5。影片放標案資料夾根目錄、**檔名不要有空白**（`demo0.mp4`…）、靜音 `.mp4`。
  頁面放 `<button class="demo-btn" onclick="playDemos(['demo0.mp4'])">`；連播多段傳陣列 `playDemos(['demo1.mp4','demo2.mp4'])`，前段 `ended` 自動接下段（尺寸不同沒關係，`object-fit:contain` 各自滿版）。
  播放層 `#vplayer`（`position:fixed;inset:0` 蓋滿畫面）＋ `playDemos()`/`closeVideo()` 已在 script 內：靜音自動播、空白暫停、Esc／點黑邊關閉、播放中擋翻頁。複製骨架一起帶走。
- **現場示範元件（對外簡報用）**：能點給對方看，比講 bullet 有說服力。三個可照搬的做法都在
  `sales-pitch/for-design-company/index-claude-v2.html`：
  - **三態切換**（P6）：`.demo-bar` 三顆鈕改同一張卡的 class 與文字，示範「設計稿／真實內容／接住後」。
  - **前後對照開關**（P8）：一個 class（`.a11y-on`）掛在容器上，用 CSS 後代選擇器一次切換整組元件的對比、focus、錯誤提示。
  - **展開式 Q&A**（P7）：原生 `<details>`，零 JS。**格線要固定**（`grid-template-rows:auto repeat(n,1fr)`），
    展開答案時其他題目不能位移；六題整併成一張有分隔線的表，不要拆成六張漂浮卡片。
- **置圖**：截圖丟 `images/`，**等比縮放**到寬約 1100px；命名對齊 deck 內既有 `<img src>`（如 `p06-tap.png`/`p07-fnac.png`），`onerror` 自動 fallback。
- **證照當背景圖**：ISO 27001 證書在 `Bid_Writing/company/certs/`。作法是 `::before` 鋪圖（`opacity:.34`）＋ `::after` 由上而下暗色漸層，
  文字壓在下半部；用 `background-position` 上下微調，讓公司抬頭落在畫面較亮的空白區。

## 新簡報要複製哪一份骨架

| 要做什麼 | 複製這份 | 拿到什麼 |
|---|---|---|
| 標案／服務建議書 | `bids/yilan-bids/index.html` | 密集版型、甘特／預算元件、`Q` 備詢層、DEMO 影片播放層 |
| 公司介紹、潛在客戶 | `sales-pitch/ctkpro-intro/index.html` | CTK 紅色系、深淺色切換、服務／案例模板頁 |
| 合作廠商、需要現場示範 | `sales-pitch/for-design-company/index-claude-v2.html` | 右側留白、七種版面骨架、三態切換／前後對照／`<details>` Q&A 表 |
| 對內內訓 | `internal-talks/prompt-context-harness-engineering/index.html` | 高橋流大字、章節節奏 |

同一份簡報若同時留兩個版本，root `index.html` 用 `.vcard` + `.vlinks` 版本切換卡（一張卡兩顆按鈕），不要各占一張卡。

## 新標案流程

1. 在 `bids/` 下建 `<案名>-bids/`（含 `images/`），複製 `bids/yilan-bids/index.html` 改 `<title>`／封面／各頁。
2. 配圖放 `images/`；要生成的插圖 `node scripts/gen-images.mjs --out bids/<案名>-bids/images`。
3. 客戶 logo 放 `images/logos/<brand>.png`（缺圖自動 fallback 成文字字標）；**放上前先確認客戶屬實**。
4. root `index.html`「標案簡報」加一張卡片連到 `bids/<案名>-bids/index.html`。
5. 驗證：瀏覽器翻一遍，或 `node scripts/shoot.mjs <案名>-bids`（短名會自動在三個分類資料夾底下找）。
   只要 `npm install` 過就能跑，**不需要 `npx playwright install`**：抓不到 Playwright 自帶瀏覽器時會退回本機 Edge／Chrome。

## 慣例

- 一律**繁體中文（台灣）**、白／淺底。
- 金額／證號／日期等**以標案文件為準**，勿臆造。
- 不要把 `node_modules/`、`.env` 進 git（已在 `.gitignore`）。
- **commit / push 只在被要求時做**。
