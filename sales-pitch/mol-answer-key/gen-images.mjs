// 「做得出來之後，怎麼驗？」專屬插圖產生器（Gemini 圖像模型）
//
// 用法（在 repo 根目錄執行）：
//   node sales-pitch/mol-answer-key/gen-images.mjs                 # 產生尚未存在的圖
//   node sales-pitch/mol-answer-key/gen-images.mjs cover deloitte  # 只產指定的圖
//   node sales-pitch/mol-answer-key/gen-images.mjs --force cover   # 強制重產
//
// API Key：沿用 ~/ctkpro_blog_posts/.env 的 GEMINI_API_KEY（與 ~/bni-ai-news 相同來源，不印出 key）。
// 輸出：本資料夾 images/<name>.jpg（1600×900，依各圖底色補邊）。
//
// 風格對齊 Aron 課程插圖（墨線水彩編輯插畫）；畫面不放任何文字。

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: '/Users/alfred/ctkpro_blog_posts/.env' });

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('❌ 找不到 GEMINI_API_KEY（預期在 /Users/alfred/ctkpro_blog_posts/.env）');
  process.exit(1);
}
const MODEL = process.env.MOL_IMAGE_MODEL || 'gemini-3-pro-image';
const IMAGES_DIR = path.join(__dirname, 'images');

const PAPER = '#FBFAF7';

// 風格對齊 Aron 第三、四堂的插圖：墨線＋水彩編輯插畫，細節豐富、一看就是生成式 AI 畫的
const STYLE = [
  'Rich contemporary editorial illustration: confident black ink linework with layered watercolor washes on warm cream paper,',
  'detailed environment and props, soft natural daylight, gentle paper grain, magazine-feature quality.',
  'Palette: cobalt and navy blue, slate blue-grey, warm ochre and sand, with a few restrained vermilion red accents on the key human action.',
  'Projector-friendly: overall light and airy, never dark or muddy.',
  'Absolutely NO readable text, NO letters, NO numbers, NO logos, NO national flags or insignia — any documents or screens show only abstract lines and blocks.',
].join(' ');

// 名稱 → { prompt, bg }
const IMAGES = {
  // S1 封面：標題在左，插圖放右半（主風格：墨線水彩）
  cover: {
    bg: PAPER,
    prompt:
      'Wide 16:9 composition. The left 45% fades into calm empty cream paper for a headline; the scene lives in the right 55%. ' +
      'A bright Taiwanese government office with a window view of a soft Taipei skyline. A friendly small white robot assistant slides a freshly printed, ' +
      'polished-looking draft report across the desk toward a mid-career Taiwanese civil servant. The civil servant is not reading casually — ' +
      'they hold a vermilion red pen and carefully compare the draft line by line against a separate answer-key checklist with tick boxes, some already ticked in red. ' +
      'Desk details: stacked colored file folders, a laptop, a mug, a potted plant, an official seal stamp waiting to be used. ' +
      'Mood: calm, attentive, the human is the one who verifies. ' + STYLE,
  },

  // 封面替代版：最早開案簡報的 3D 公仔風
  'cover-3d': {
    bg: PAPER,
    prompt:
      'Wide 16:9 composition, scene on the right 55%, left side clean pale background for a headline. ' +
      'Soft glossy 3D clay render, cute chibi style like a premium Pixar-esque mascot illustration. A Taiwanese office worker character in a navy blazer with glasses ' +
      'holds a red pen and checks a large floating document against an answer-key clipboard with ticked boxes; a small cute white robot beside them proudly hands over the document. ' +
      'Around them, floating glossy 3D icons: folders, a magnifying glass, a red check mark, a stamp. Clean pale ivory and light blue background, soft studio lighting, gentle shadows. ' +
      'Absolutely NO readable text, NO letters, NO numbers, NO logos.',
  },

  // Deloitte × 澳洲就業與勞資關係部：引用了不存在的文獻
  deloitte: {
    bg: PAPER,
    prompt:
      'Wide 16:9 composition, scene centered-right, left third quieter for text. ' +
      'A university library reading room in daylight. A focused academic (middle-aged, cardigan) sits at a long wooden table with a thick, glossy, very official-looking ' +
      'consultancy report open in front of them, its pages full of neat charts and footnotes. With a magnifying glass they trace one footnote. ' +
      'Around the table: open law journals, sticky tabs, a notepad with red marks. Behind them a tall bookshelf where one slot is conspicuously EMPTY, ' +
      'with a faint translucent ghost outline of a book that was never there, dissolving into dust — the cited source does not exist. ' +
      'A thin vermilion dotted line connects the footnote to the empty slot. Mood: quiet discovery of a serious error inside an impressive-looking document. ' + STYLE,
  },

  // S4 美軍情報：白天、陰天，從「桌上的報告」到「軍機升空」
  'cargo-ship': {
    bg: PAPER,
    prompt:
      'Wide 16:9 composition, daytime, overcast steel-blue and grey sky — tense but NOT night and NOT dark. ' +
      'Foreground lower-left: the corner of an operations desk with a crisp, official-looking printed intelligence briefing in a binder, a vermilion red alert clip on it, ' +
      'a coffee cup, a headset — the report that nobody double-checked. ' +
      'Through a large window behind the desk, the open sea: a big container cargo ship with plain unmarked hull, a grey military helicopter approaching it low over the waves, ' +
      'and two fighter jets streaking across the sky with contrails. Choppy sea, wind, sense of an escalating decision. ' +
      'No weapons firing, no explosions, no flags or insignia. ' + STYLE,
  },

  // 紐約市府 AI 客服教老闆違法（直式，放問答左欄）
  'nyc-mycity': {
    bg: PAPER,
    prompt:
      'Portrait 2:3 composition. A small family restaurant in New York City in the morning before opening: brick wall, chalkboard menu with only abstract squiggles, ' +
      'a glass tip jar on the counter, a waiter tying an apron in the background. The owner leans on the counter looking at a tablet that shows an official-looking ' +
      'city-government help chatbot: a friendly chat bubble interface in slate blue (abstract lines only, no words). Through the window: brownstones and a yellow taxi. ' +
      'Subtle hint of trouble: a small vermilion warning mark hovering near the chat bubble. Mood: an ordinary business owner trusting an authoritative-looking answer. ' + STYLE,
  },

  // S18 有沒有答案卷：憑感覺 vs 逐項對照（直式，放右欄）
  'answer-key': {
    bg: PAPER,
    prompt:
      'Portrait 4:5 composition split into an upper and lower vignette on the same cream paper, no frame lines. ' +
      'UPPER vignette: a civil servant holding a long AI-generated report at arm\'s length, squinting, unsure, a vague cloud of question marks drawn as abstract swirls (no characters). ' +
      'LOWER vignette: the same civil servant calmly laying the report next to a short answer-key checklist and ticking items one by one with a vermilion red pen, ' +
      'a small white robot assistant waiting beside the desk. Mood: from guessing to checking. ' + STYLE,
  },

  // S23 錯題本：出過的錯變成每天考的考題
  'mistake-notebook': {
    bg: PAPER,
    prompt:
      'Wide 3:2 composition. A thick, well-used "mistake notebook" lying open on a desk, its pages filled with pasted cut-out cards of past errors, each card marked with a small vermilion cross, ' +
      'colored sticky tabs sticking out of the edges showing it keeps growing. Next to it, a small white robot sits at a tiny school desk taking a quiz drawn from those cards, ' +
      'pencil in hand, a progress chart pinned behind it trending upward (abstract bars, no numbers). Warm daylight, cozy office corner, plants, a calendar with abstract boxes. ' +
      'Mood: every past mistake becomes tomorrow\'s exam question. ' + STYLE,
  },

  // S27 颶風：AI 畫路徑，預報員按警報
  hurricane: {
    bg: PAPER,
    prompt:
      'Wide 3:2 composition. Inside a national weather forecasting center by day. A large wall screen shows a satellite view of a swirling hurricane over the ocean with a ' +
      'slate-blue forecast track and cone drawn by AI (abstract, no labels). In the foreground a human forecaster with a headset stands at a console, one hand resting on a ' +
      'single vermilion red alert button, looking at the screen thoughtfully before pressing it; colleagues and phones in the background. ' +
      'Mood: the machine predicts, the human decides and takes responsibility. ' + STYLE,
  },

  // S30 決策＝預測＋判斷：天平
  decision: {
    bg: PAPER,
    prompt:
      'Wide 3:2 composition. A large elegant brass balance scale on a wooden desk in a bright office. On the left pan: a small white robot carefully placing a glowing slate-blue ' +
      'crystal ball and a stack of forecast charts (abstract lines) — prediction. On the right pan: a human hand gently setting down a traditional red seal stamp and a pen — judgment. ' +
      'The scale is balanced. Soft daylight, documents and a teacup nearby. Mood: AI forecasts, humans judge; both are needed. ' + STYLE,
  },

  // 收尾①：四堂課的旅程（寬幅橫條）
  journey: {
    bg: PAPER,
    prompt:
      'Very wide panoramic 16:9 composition meant to be cropped into a horizontal band. A gentle winding path through a soft Taiwanese landscape — rice fields, low green hills, ' +
      'a distant city skyline — rising from left to right. Along the path stand five small milestone markers (simple stone posts with only abstract symbols: a lightbulb, a toolbox, ' +
      'a filing folder, a personal notebook with a pen, and at the top right a large magnifying glass with a vermilion red check mark). A small group of civil servants in office ' +
      'clothes walk the path together with a friendly little white robot, the leaders already near the fourth marker, looking toward the fifth. ' +
      'Morning light, hopeful, forward-looking. ' + STYLE,
  },

  // 收尾②：你的位置
  position: {
    bg: PAPER,
    prompt:
      'Portrait 4:5 composition. A bright, modern Taiwanese public office seen from a slight low angle. Several small white robot assistants busily carry and sort stacks of documents ' +
      'along a desk toward the front, like a smooth flowing workflow. At the end of the desk, a confident civil servant stands upright and calm, holding a traditional red seal stamp ' +
      'above the final document, a checklist (answer key) beside them; sunlight through tall windows falls on them. ' +
      'Mood: dignified, hopeful — the human holds the position the machines cannot take: defining what is right, judging, and signing for the consequences. ' + STYLE,
  },

  // 收束頁：呼應封面的 3D 公仔風
  'closing-3d': {
    bg: PAPER,
    prompt:
      'Wide 16:9 composition, scene on the right 50%, left side clean pale ivory background for a headline. ' +
      'Soft glossy 3D clay render, cute chibi style, same characters as a premium mascot set: a Taiwanese office worker character in a navy blazer with glasses ' +
      'confidently pressing a big red approval seal stamp onto a document that sits on top of a neat answer-key clipboard full of red check marks; ' +
      'a small cute white robot beside them gives a happy thumbs-up, a few floating glossy 3D icons (folder, magnifying glass, red check). ' +
      'Clean pale ivory and light blue background, soft studio lighting. Absolutely NO readable text, NO letters, NO numbers, NO logos.',
  },
};

// 預設走 OpenAI（同一份 .env 的 IMAGE_PROVIDER）；Gemini 預付額度用完時也能出圖
const PROVIDER = process.env.MOL_IMAGE_PROVIDER || process.env.IMAGE_PROVIDER || 'gemini';
const OPENAI_MODEL = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';

async function fetchOpenAI(prompt) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    body: JSON.stringify({ model: OPENAI_MODEL, prompt, size: '1536x1024', quality: 'high', n: 1 }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`${res.status} ${JSON.stringify(data.error || data).slice(0, 300)}`);
  return Buffer.from(data.data[0].b64_json, 'base64');
}

async function save(name, buf, bg) {
  // 輸出 JPG：PNG 一張 3–4 MB，投影現場網路慢時載不動
  const outPath = path.join(IMAGES_DIR, `${name}.jpg`);
  await sharp(buf)
    .resize(1600, 900, { fit: 'cover', position: 'centre' })
    .flatten({ background: bg })
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(outPath);
  const { size } = await fs.stat(outPath);
  console.log(`  ✅ ${name}.jpg（${(size / 1024).toFixed(0)} KB）`);
}

async function generateOne(name, { prompt, bg }) {
  if (PROVIDER === 'openai') return save(name, await fetchOpenAI(prompt), bg);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ['IMAGE'], imageConfig: { aspectRatio: '16:9' } },
  };

  let data;
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': API_KEY },
      body: JSON.stringify(body),
    });
    if ((res.status === 503 || res.status === 429) && attempt < 3) {
      console.warn(`  ⚠️  ${res.status}，${attempt * 15}s 後重試`);
      await new Promise((r) => setTimeout(r, attempt * 15000));
      continue;
    }
    data = await res.json();
    if (!res.ok) throw new Error(`${res.status} ${JSON.stringify(data.error || data).slice(0, 300)}`);
    break;
  }

  const parts = data?.candidates?.[0]?.content?.parts || [];
  const img = parts.find((p) => p.inlineData);
  if (!img) throw new Error('回應中找不到圖片資料：' + JSON.stringify(parts).slice(0, 200));

  await save(name, Buffer.from(img.inlineData.data, 'base64'), bg);
}

const argv = process.argv.slice(2);
const force = argv.includes('--force');
const only = argv.filter((a) => !a.startsWith('--'));
const targets = Object.entries(IMAGES).filter(([n]) => only.length === 0 || only.includes(n));
if (targets.length === 0) {
  console.error(`找不到指定的圖名。可用：${Object.keys(IMAGES).join(', ')}`);
  process.exit(1);
}

await fs.mkdir(IMAGES_DIR, { recursive: true });
console.log(`🎨 ${PROVIDER}：${PROVIDER === 'openai' ? OPENAI_MODEL : MODEL}　📁 ${IMAGES_DIR}`);
await Promise.all(
  targets.map(async ([name, spec]) => {
    if (!force) {
      try { await fs.access(path.join(IMAGES_DIR, `${name}.jpg`)); console.log(`⏭️  ${name} 已存在`); return; } catch {}
    }
    console.log(`⏳ ${name} …`);
    try { await generateOne(name, spec); } catch (e) { console.error(`  ❌ ${name}：${e.message}`); }
  })
);
