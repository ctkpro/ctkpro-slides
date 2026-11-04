# Genabot 初次會議簡報：策略與規劃

> 會議：2026-11-05 上午｜對方**主動來接洽**｜類型：潛在客戶簡報（首次見面）
> 語言：**英文標題＋中文內文**｜骨架：`ctkpro-intro` 的 CTK 紅淺色版 ＋ `for-design-company/index-claude-v2.html` 的互動元件

---

## 1. 對方是誰

| 項目 | 內容 | 來源 |
|---|---|---|
| 公司 | Genabot, Inc.（官網 genabot.ai，注意拼法不是 Genebot） | 官網 |
| 定位 | 官網：半導體廠智慧感測器＋AI 分析（良率、預測維護、品質）。LinkedIn：**AI Robotics**，工業巡檢、維護、自主檢測 | 官網、LinkedIn |
| 據點 | 總部 Cupertino（10080 N Wolfe Rd）；**台灣也有營運**，台北有 GM/COO Steven Lin | LinkedIn |
| 階段 | 2025 年成立；2025/12 種子輪約 US$2M；加州登記 2026/1/28；PitchBook 記 3 人，LinkedIn 寫 11–50 人 | PitchBook、VCBacked、加州登記 |
| 創辦人 | Tsung-Ching Jim Huang（CEO）。研究柔性電子、電路設計，關注 Physical AI 與穿戴裝置，h-index 23 | Google Scholar |
| 官網現況 | Wix 建置，文案通用，只列 Smart Sensors 一項；沒有團隊、產品與案例；品牌色偏紫 | 官網 |
| 職缺 | Hardware Engineer、AI Specialist、QA Manager、Technology Solutions Architect，**沒有前端或 UX 職缺** | 官網 Careers |

**判讀：** 硬體與研究實力強，產品介面、網站、軟體平台是他們缺的那一塊。資金有限，很在意速度，會希望分階段、小規模合作。

## 2. 他們可能找我們做什麼（依可能性排序）

1. **監控儀表板／操作介面**：要給試點晶圓廠和投資人看的畫面。
2. **資料平台／管理後台**：設備清冊、角色權限、稽核 log、API 層。
3. **官網改版**：從 Wix 模板升級成可信的科技品牌，對募資和晶圓廠採購都有幫助。

**不碰的範圍（主動講清楚）：** 感測器韌體、AI 模型、MES／SECS-GEM 整合由他們負責。我們接他們的 API，負責介面層、後台、網站與維運。

## 3. 策略

1. **以傾聽為主。** 對方主動來找，會議至少一半時間讓他們說。簡報收在約 13 頁，其中一頁是「我們想先了解的事」。
2. **不猜他們的產品，研究他們的畫面會被放在什麼環境。** Demo 只做一個小元件，模擬晶圓廠現場的四種條件（見第 5 節）。AI 能快速做出儀表板，但想不到要先檢查黃光區和手套這些現場條件。
3. **無障礙只寫 WCAG，不標 A／AA 等級。** 用條文編號（1.4.1、1.4.11、2.5.8……）對應現場問題，把無障礙講成**操作員安全**。
4. **資安講「幫你過晶圓廠的供應商審查」。** 用 ISO 27001:2022 加安全開發流程，協助他們回答晶圓廠的資安問卷。**不宣稱能讓他們的設備通過 SEMI E187／IEC 62443。**
5. **CTA 低壓、分階段。** 先做 2–3 週的 Discovery＋可點原型，產出一個他們能拿去給第一個試點晶圓廠看的畫面。

## 4. 投影片大綱（13 頁 ＋ Q 備詢層）

| # | 英文標題 | 中文重點 | 版型 |
|---|---|---|---|
| 1 | From Sensor Data to Screens Operators Trust | CTK Pro × Genabot | 封面大字 |
| 2 | What We Heard | 我們對 Genabot 的理解：階段、美台雙據點、從感測器走向機器人巡檢。講完請對方指正 | 時間軸 |
| 3 | Where Partners Usually Help | 這個階段常見三種需求：介面、後台、官網。用提問方式呈現 | 三欄 |
| 4 | About CTK Pro | 2011 年成立、長期維運網站數、ISO 27001:2022、資深小團隊、不轉包 | 精簡數字 |
| 5 | Semiconductor & Chip Security | 半導體與晶片資安客戶（INPSY、PUFsecurity、eMemory、Chip Security Lab） | 截圖拼貼 |
| 6 | Hardware Brands & Infrastructure | ASUS／ROG、台電，加上系統串接案例 | 拼貼＋一張架構圖 |
| 7 | **Live Demo: Fab Floor Readability Test** | 見第 5 節 | 瀏覽器外框示範區 |
| 8 | UX for Operations | 平時安靜、只有異常才用顏色；警報分級（ISA-18.2 口頭帶過）；戴手套也點得到；中英夾雜的廠內術語 | 左右對照 |
| 9 | Security by Process | ISO 證書當背景；安全開發四階段；晶圓廠供應商資安問卷怎麼一起準備 | 深色證照塊 |
| 10 | Website as Credibility | 官網對募資與晶圓廠採購的作用；以 INPSY、PUFsecurity 為例 | 截圖＋三點 |
| 11 | How We'd Work Together | Discovery 與原型 → MVP → 維運；分工兩欄同重量；AI 加速但每段人工審查；美台時差銜接 | 左右流程 |
| 12 | Questions We'd Like to Ask | 我們想先了解的事（見第 7 節） | 整併表格 |
| 13 | Thank You | QR、聯絡方式 | 感謝頁 |
| Q | （備詢層） | 團隊規模、廠內部署、英文溝通、報價方式、IP 歸屬、NDA | `Q` 鍵開啟 |

## 5. Demo 規格：Fab Floor Readability Test

**畫面：** 左右兩組相同的設備狀態卡（4 台：Normal／Warning／Alarm／Offline）。
- 左組 **Typical**：紅黃綠燈，只靠顏色區分，字小、按鈕小。
- 右組 **Designed for the floor**：形狀＋文字標籤＋亮度差都有，目標尺寸夠大。
- 設備名稱一律用通用代號（Tool A–D），**不模仿 Genabot 的產品**。

**開關（一次一個，或疊加）：**

| 開關 | 模擬方式 | 左組結果 | 右組結果 | WCAG |
|---|---|---|---|---|
| 一般照明 | 原色 | 都可讀 | 都可讀 | — |
| 黃光區 Yellow room | SVG `feColorMatrix` 去掉藍色通道並偏黃 | 黃色警告消失在底色裡，藍、紫變近黑 | 形狀與文字仍可辨識 | 1.4.1、1.4.11 |
| 色弱 Color vision | 紅綠色盲（deuteranopia）矩陣 | 紅綠分不出來 | 仍可辨識 | 1.4.1 |
| 戴手套 Gloved touch | 疊上一個約指腹大小的觸控圓 | 圓同時蓋到兩顆按鈕 | 只蓋到一顆 | 2.5.8 |
| 2 公尺外 At 2 m | 縮放＋輕微模糊 | 狀態字看不清 | 狀態仍可判讀 | 1.4.3 |

**收尾提問：** 「你們的設備會進黃光區嗎？操作員會戴手套用平板嗎？」

**措辭注意：** 微影區濾掉約 500 nm 以下的光是業界常規，但**螢幕要不要濾藍光，各廠做法不同**。畫面要寫成假設語氣：「如果你的螢幕在黃光區……」。紫色品牌色在黃光下變暗這件事只口頭帶，不上畫面。

## 6. 案例素材

| 組別 | 案例 | 狀態 | 素材 |
|---|---|---|---|
| 半導體 | INPSY 官網＋投資人專區（中英） | 可公開，有公開網址 | `../shantai-amc/images/inpsy-home-reference.png` |
| 半導體 | PUFsecurity 三語官網 | 可公開 | `../shantai-amc/images/pufsecurity-hero.jpg` |
| 半導體 | eMemory 力旺、Chip Security Lab | **做了什麼待補** | logo：`../shantai-amc/images/partner-logos.png` |
| 半導體 | 山太士（半導體製程材料）官網改版 | 合約執行中，**措辭待定**（例如寫「進行中」） | `../shantai-amc/images/` |
| 硬體／基礎設施 | ASUS 品牌網站（2022，企業級權限）、ROG | **ROG 做了什麼待補** | `../../bids/yilan-bids/images/logos/asus.png` |
| 硬體／基礎設施 | 台電 | **做了什麼待補** | logo 牆 |
| 系統 | 李綜合醫院 HIS 三層 API（病患資料不落地、稽核 log） | 開發中 | `../lgh-reg-meeting/` 架構圖 |
| 系統 | 法雅客：電商與十萬名會員資料移轉 | 可公開 | `../../bids/yilan-bids/images/p07-fnac.png` |
| 待補 | Cloudways 上的完整客戶名單 | MCP token 權限不足，**需要 Alfred 手動提供** | — |

**主機現況（Cloudways MCP，2026-11-04）：** 6 台運作中的主機上共 83 個 app，其中約 70 個有資料量（含 staging）。這組數字支持「70+ 網站長期維運」的說法。

## 7. 我們想先了解的事（第 12 頁草稿）

- 你們目前最想先讓誰看到東西？投資人、試點晶圓廠，還是內部團隊？
- 系統會部署在雲端、廠內，還是兩種都有？
- 操作的人是誰？在什麼環境？（無塵室、黃光區、戴手套、平板或固定螢幕）
- 試點客戶在美國還是台灣？要對應哪些資安要求？
- 這次想找的是設計、開發、維運，還是三段一起？

## 8. 待確認

- [ ] Cloudways 客戶名單（請 Alfred 登入後提供，或開放 MCP token 的 app 讀取權限）
- [ ] eMemory、Chip Security Lab、台電、ROG 實際做了什麼
- [ ] 山太士要怎麼寫（點名或匿名、「進行中」）
- [ ] 團隊規模的對外說法
- [ ] 早期 App 案子有沒有接硬體或 IoT
