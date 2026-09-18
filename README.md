# CTK Pro 標案簡報庫（bid-slides）

CTK Pro（竑盛科技）參加標案評選用的簡報集合。暖白底極簡、投影機友善、單檔自足 HTML，可推上 GitHub Pages。

## 直接播放

用瀏覽器開對應的 `index.html` 即可：

- 著陸頁（目錄）：`index.html`
- 宜蘭縣育兒資源網 2.0 服務建議書：`bids/yilan-bids/index.html`
- 桃園市原住民族發展基金會品牌網站：`bids/桃原基會-bids/index.html`
- CTK Pro 公司介紹：`sales-pitch/ctkpro-intro/index.html`
- 給設計公司的合作提案：`sales-pitch/for-design-company/index-claude-v2.html`（A 版，現場可點示範）／`index-v2.html`（B 版，靜態排版）
- 2026 Q3 全員發表：`internal-talks/2026q3-all-hands/index.html`
- Prompt · Context · Harness 深化版：`internal-talks/prompt-context-harness-engineering/index.html`
- 別把「判斷」也外包出去（認知外包 Retro 分享）：`internal-talks/2026q3-cognitive-offloading/index.html`

投影片依用途分三類：`bids/`（標案）、`sales-pitch/`（對外）、`internal-talks/`（對內）。

製作新簡報前，先參考 `guides/簡報敘事角度與用詞原則.md`，確認聽眾角色、講者位置、敘事語氣與 CTA，避免不同簡報之間視角飄移。

### 操作方式

| 動作 | 按鍵 / 手勢 |
|------|------------|
| 下一頁 | `→`、`↓`、空白、`PageDown`、點畫面**右 1/6**、右下 `›`、向左滑 |
| 上一頁 | `←`、`↑`、`PageUp`、點畫面**左 1/6**、右下 `‹`、向右滑 |
| 首頁 / 末頁 | `Home` / `End` |
| 全螢幕 | `F` |
| 備詢 QA（評審問答） | `Q` 開啟、`Q` / `Esc` 關閉 |
| 播放示範影片 | 頁面上「示範」鈕；播放中空白暫停、`Esc`／點黑邊關閉 |

右下角顯示頁碼（`目前 / 總頁`），底部有進度條。畫面中間 2/3 點擊不翻頁，方便簡報時選字強調。
部分簡報有深淺色切換（`T` 或右上角按鈕），部分頁面有可現場點按的示範元件（切換鈕、展開式問答），點它們不會翻頁。

### 新簡報要複製哪一份骨架

| 要做什麼 | 複製這份 |
|---|---|
| 標案／服務建議書 | `bids/yilan-bids/index.html`（密集版型、甘特／預算、`Q` 備詢層、示範影片） |
| 公司介紹、潛在客戶 | `sales-pitch/ctkpro-intro/index.html`（CTK 紅、深淺色切換、案例模板） |
| 合作廠商、需要現場示範 | `sales-pitch/for-design-company/index-claude-v2.html`（右側留白、多種版面骨架、互動示範元件） |
| 對內內訓 | `internal-talks/prompt-context-harness-engineering/index.html`（大字、章節節奏） |

同一份簡報留兩個版本時，root `index.html` 用一張卡片放兩個版本連結（`.vcard` / `.vlinks`）。

## 部署到 GitHub Pages

1. 把整個專案推上 `ctkpro/bid-slides`（各 `index.html` 已是相對路徑）。
2. repo → **Settings** → **Pages** → Source 選 **Deploy from a branch**，分支 `main`、資料夾 `/ (root)`，Save。
3. 用顯示的網址播放（例：`https://ctkpro.github.io/bid-slides/bids/yilan-bids/`）。

## 作圖工具（選用）

產生白底極簡風插圖，重用 Gemini。**API key 放在本庫 `.env` 的 `GEMINI_API_KEY`**（由 `~/hermes-slides/.env` 複製，已被 `.gitignore` 排除）。

```bash
npm install                                   # 安裝 @google/generative-ai、sharp、dotenv、playwright
node scripts/gen-images.mjs                    # 產 images/ 內尚未存在的圖
node scripts/gen-images.mjs --out bids/yilan-bids/images   # 指定輸出資料夾
node scripts/gen-images.mjs --force sys-arch          # 強制重產指定圖
node scripts/shoot.mjs yilan-bids              # Playwright 逐頁截圖到 /tmp 驗證外觀
node scripts/shoot.mjs sales-pitch/for-design-company/index-claude-v2.html   # 也可直接給路徑
```

截圖不需要 `npx playwright install`：抓不到 Playwright 自帶瀏覽器時會自動退回本機的 Edge／Chrome。

- 風格：白底、淡藍墨（`#2f4fb0`）線稿插畫、留白、無文字；輸出 16:9 PNG。
- 模型：Google Gemini（預設 `gemini-3-pro-image-preview`，可用 `GEMINI_IMAGE_MODEL` 覆寫）。

## 檔案結構

見 [CLAUDE.md](CLAUDE.md)。新標案：在 `bids/` 下複製 `bids/yilan-bids/index.html` 當骨架，改內容並在 root `index.html` 加卡片；
其他用途的骨架見上面「新簡報要複製哪一份骨架」。
