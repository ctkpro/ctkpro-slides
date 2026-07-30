// 截圖驗證腳本：開啟指定 deck 的 index.html，逐頁截圖到 /tmp
//
// 用法：
//   node scripts/shoot.mjs                           # 預設截 bids/yilan-bids/index.html
//   node scripts/shoot.mjs ctkpro-intro              # 短名，自動在 bids/ sales-pitch/ internal-talks/ 找
//   node scripts/shoot.mjs bids/yilan-bids/index.html # 指定路徑
//
// 自動偵測頁數（讀 .slide 數量），逐頁按右鍵截圖。
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const BUCKETS = ['bids', 'sales-pitch', 'internal-talks'];

let target = process.argv[2] || 'yilan-bids';
if (!target.endsWith('.html')) target = path.join(target, 'index.html');
// 短名（如 ctkpro-intro/index.html）先在三個分類資料夾底下找
if (!path.isAbsolute(target) && !fs.existsSync(path.join(PROJECT_ROOT, target))) {
  const hit = BUCKETS.map(b => path.join(b, target)).find(p => fs.existsSync(path.join(PROJECT_ROOT, p)));
  if (hit) target = hit;
}
const file = path.isAbsolute(target) ? target : path.join(PROJECT_ROOT, target);
const url = 'file://' + file;
const tag = target.replace(/[\/]/g, '-').replace(/\.html$/, '');

// 沒跑過 npx playwright install 時，退回用本機已裝的 Edge / Chrome，不必另外下載瀏覽器
const browser = await chromium.launch().catch(() =>
  chromium.launch({ channel: 'msedge' }).catch(() => chromium.launch({ channel: 'chrome' }))
);
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
await page.goto(url);
await page.waitForTimeout(600);

const total = await page.evaluate(() => document.querySelectorAll('.slide').length);
console.log(`${tag}: ${total} 頁`);

for (let i = 1; i <= total; i++) {
  await page.screenshot({ path: `/tmp/${tag}-${String(i).padStart(2, '0')}.png` });
  console.log(`shot ${i}/${total}`);
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(450);
}
await browser.close();
console.log('done → /tmp/' + tag + '-*.png');
