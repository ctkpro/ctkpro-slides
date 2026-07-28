// 產生標案簡報用插畫圖（重用 ctkpro_blog_posts 的 Gemini 呼叫邏輯）
// 風格：白底極簡 — 淡藍墨線稿插畫、白/淺底、柔和、無文字，與白底極簡簡報一致。
//
// 用法：
//   node scripts/gen-images.mjs                         # 產生 IMAGES 中尚未存在的圖到預設 images/
//   node scripts/gen-images.mjs --force                 # 強制重產全部
//   node scripts/gen-images.mjs --out bids/yilan-bids/images # 指定輸出資料夾（各標案用）
//   node scripts/gen-images.mjs sys-arch                # 只產指定的圖
//
// API Key 來源：本庫 .env 的 GEMINI_API_KEY（由 ~/hermes-slides/.env 複製而來）。

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import sharp from 'sharp';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');

// 讀本庫自己的 .env（不指向外部、不印出 key）
dotenv.config({ path: path.join(PROJECT_ROOT, '.env') });

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('❌ 找不到 GEMINI_API_KEY（預期在 ' + path.join(PROJECT_ROOT, '.env') + '）');
  console.error('   請從 ~/hermes-slides/.env 複製 GEMINI_API_KEY 過來，或參考 .env.example。');
  process.exit(1);
}
const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-3-pro-image-preview';

// 解析參數：--out <dir> 指定輸出資料夾；--force 強制重產；其餘為指定圖名
const argv = process.argv.slice(2);
const force = argv.includes('--force');
let outDir = 'images';
const onlyNames = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--force') continue;
  if (a === '--out') { outDir = argv[++i]; continue; }
  if (a.startsWith('--')) continue;
  onlyNames.push(a);
}
const IMAGES_DIR = path.isAbsolute(outDir) ? outDir : path.join(PROJECT_ROOT, outDir);

// 統一風格約束：白底極簡（與白底簡報設計系統一致）
// = 白/淺底、淡藍墨（#2f4fb0 系）細線稿插畫、大量留白、柔和、無文字
const STYLE = [
  'Minimal flat line-art illustration on a clean WHITE / very light background.',
  'Thin elegant line work drawn in soft blue ink (around #2f4fb0), with sparse light blue-grey accents only.',
  'Lots of negative space, calm, modern, professional and trustworthy — a clean editorial / enterprise look.',
  'No paper texture, no wood, no photographic realism; vector-like simple sketch with subtle shading.',
  'Balanced composition that reads clearly when projected.',
  'Absolutely NO readable text, NO words, NO letters, NO numbers, NO captions.',
].join(' ');

// 要產生的圖：檔名 → prompt。各標案可依需要增刪（搭配 --out 指定輸出資料夾）。
// 下列為標案常用的通用示意圖，預設輸出到 images/。
const IMAGES = {
  // 系統架構：多角色一條龍（家長/現場/承辦）
  'sys-arch':
    `A minimal line diagram of a connected system serving three roles. ` +
    `Three simple nodes (a parent with a phone, a service-counter desk, an administrator at a computer) ` +
    `linked by clean arrows into one central platform/database in the middle. ` +
    `Convey an end-to-end, integrated workflow. ${STYLE}`,

  // 資料移轉：舊資料 → 去重/重綁 → 新主檔
  'data-migration':
    `A minimal line illustration about migrating records safely. ` +
    `On the LEFT a messy stack of duplicated record cards, in the MIDDLE a funnel / matching process, ` +
    `on the RIGHT a single clean unified record with a check mark. ` +
    `Convey deduplication and re-binding of data into one trusted master record. ${STYLE}`,

  // 資安：分層權限 + 盾牌
  'security':
    `A minimal line illustration of information security as layered control. ` +
    `A shield in the center, around it small icons hinting at access layers, a key, a log/audit trail, ` +
    `and a lock — simple and clean. Convey least-privilege access and auditability. ${STYLE}`,
};

async function generateOne(genAI, name, prompt) {
  const enhanced =
    `IMPORTANT: This image must contain NO text at all. If any text appears it MUST be Traditional Chinese (繁體中文), ` +
    `never Simplified Chinese.\n\n${prompt}`;

  const model = genAI.getGenerativeModel({ model: MODEL });

  // 對暫時性錯誤 (503/429) 做指數退避重試
  const maxRetries = 3;
  let result;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      result = await model.generateContent(enhanced);
      break;
    } catch (err) {
      const status = err.status || err.httpCode;
      if ((status === 503 || status === 429) && attempt < maxRetries) {
        const delay = attempt * 15000;
        console.warn(`  ⚠️  API 暫時無法使用 (${status})，${delay / 1000}s 後重試 (${attempt}/${maxRetries})`);
        await new Promise((r) => setTimeout(r, delay));
      } else {
        throw err;
      }
    }
  }

  const response = await result.response;
  if (!response.candidates || response.candidates.length === 0) {
    throw new Error('回應中沒有 candidates');
  }

  const parts = response.candidates[0].content.parts;
  let imageData = null;
  for (const part of parts) {
    if (part.inlineData) {
      imageData = part.inlineData.data;
      break;
    } else if (part.text) {
      console.log(`  ℹ️  AI 文字回應：${part.text.slice(0, 120)}`);
    }
  }
  if (!imageData) {
    throw new Error('回應中找不到圖片資料');
  }

  const rawBuffer = Buffer.from(imageData, 'base64');

  // 用 Sharp 統一成橫式 16:9 PNG；letterbox 補白，與白底簡報融合
  const WHITE = '#ffffff';
  const outPath = path.join(IMAGES_DIR, `${name}.png`);
  await sharp(rawBuffer)
    .resize(1600, 900, { fit: 'contain', background: WHITE })
    .flatten({ background: WHITE })
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(outPath);

  const { size } = await fs.stat(outPath);
  console.log(`  ✅ ${name}.png （${(size / 1024).toFixed(0)} KB）`);
  return outPath;
}

async function main() {
  await fs.mkdir(IMAGES_DIR, { recursive: true });

  const targets = Object.entries(IMAGES).filter(([name]) =>
    onlyNames.length === 0 ? true : onlyNames.includes(name)
  );

  if (targets.length === 0) {
    console.error(`找不到指定的圖名。可用：${Object.keys(IMAGES).join(', ')}`);
    process.exit(1);
  }

  console.log(`🎨 使用模型：${MODEL}`);
  console.log(`📁 輸出目錄：${IMAGES_DIR}\n`);

  const genAI = new GoogleGenerativeAI(API_KEY);

  for (const [name, prompt] of targets) {
    const outPath = path.join(IMAGES_DIR, `${name}.png`);
    if (!force) {
      try {
        await fs.access(outPath);
        console.log(`⏭️  ${name}.png 已存在，略過（用 --force 重產）`);
        continue;
      } catch {
        // 不存在 → 產生
      }
    }
    console.log(`⏳ 產生 ${name} …`);
    try {
      await generateOne(genAI, name, prompt);
    } catch (err) {
      console.error(`  ❌ ${name} 產生失敗：${err.message}`);
    }
  }

  console.log('\n完成。');
}

main().catch((err) => {
  console.error('腳本錯誤：', err);
  process.exit(1);
});
