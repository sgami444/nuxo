import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const SOURCE_URL = process.env.SOURCE_URL || 'https://nuxo-care.preview.emergentagent.com/';
const CUSTOM_DOMAIN = process.env.CUSTOM_DOMAIN || 'nuxo.in';
const OUT_DIR = path.resolve(process.env.OUT_DIR || 'dist');
const WAIT_MS = Number(process.env.WAIT_MS || 4000);

const source = new URL(SOURCE_URL);
const savedResources = new Map();
const pendingSaves = [];

function sha(input) {
  return crypto.createHash('sha1').update(input).digest('hex').slice(0, 10);
}

function safeSegment(segment) {
  const decoded = decodeURIComponent(segment || '');
  return decoded
    .replace(/[<>:"|?*\\]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '') || 'file';
}

function extFromContentType(contentType = '') {
  const type = contentType.split(';')[0].trim().toLowerCase();
  const map = {
    'text/html': '.html',
    'text/css': '.css',
    'application/javascript': '.js',
    'text/javascript': '.js',
    'application/x-javascript': '.js',
    'application/json': '.json',
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/svg+xml': '.svg',
    'image/x-icon': '.ico',
    'font/woff': '.woff',
    'font/woff2': '.woff2',
    'application/font-woff': '.woff',
    'application/font-woff2': '.woff2',
    'application/vnd.ms-fontobject': '.eot',
    'font/ttf': '.ttf',
    'font/otf': '.otf',
    'video/mp4': '.mp4',
    'audio/mpeg': '.mp3'
  };
  return map[type] || '';
}

function localPathForUrl(rawUrl, contentType = '') {
  const u = new URL(rawUrl);
  const sameOrigin = u.origin === source.origin;
  let pathname = decodeURIComponent(u.pathname || '/');

  if (pathname === '/' || pathname === '') {
    return 'index.html';
  }

  let parts = pathname.split('/').filter(Boolean).map(safeSegment);
  let last = parts[parts.length - 1] || 'index';
  const hasExtension = /\.[A-Za-z0-9]{1,8}$/.test(last);
  const inferredExt = extFromContentType(contentType);

  if (!hasExtension && inferredExt) {
    last += inferredExt;
  } else if (!hasExtension && pathname.endsWith('/')) {
    parts.push('index.html');
    last = 'index.html';
  }
  parts[parts.length - 1] = last;

  // Preserve query-specific files without using unsafe filename characters.
  if (u.search) {
    const ext = path.extname(last);
    const base = ext ? last.slice(0, -ext.length) : last;
    parts[parts.length - 1] = `${base}.${sha(u.search)}${ext}`;
  }

  if (!sameOrigin) {
    return path.join('_external', safeSegment(u.hostname), ...parts);
  }

  return path.join(...parts);
}

function browserPath(relPath) {
  // GitHub Pages custom-domain deploys are served from domain root.
  return '/' + relPath.split(path.sep).join('/');
}

async function saveBuffer(relPath, body) {
  const abs = path.join(OUT_DIR, relPath);
  await fs.mkdir(path.dirname(abs), { recursive: true });
  await fs.writeFile(abs, body);
}

function shouldSaveResponse(response) {
  const request = response.request();
  const url = response.url();
  const status = response.status();
  const type = request.resourceType();
  const headers = response.headers();
  const contentType = headers['content-type'] || '';

  if (!/^https?:\/\//i.test(url)) return false;
  if (status < 200 || status >= 400) return false;

  const u = new URL(url);
  const sameOrigin = u.origin === source.origin;
  const assetLike = /text\/css|javascript|json|image\/|font\/|audio\/|video\/|svg|woff|ttf|otf/i.test(contentType);

  return sameOrigin || assetLike || ['image', 'stylesheet', 'script', 'font', 'media'].includes(type);
}

async function saveResponse(response) {
  if (!shouldSaveResponse(response)) return;

  const url = response.url();
  const contentType = response.headers()['content-type'] || '';
  const relPath = localPathForUrl(url, contentType);

  if (savedResources.has(url)) return;
  savedResources.set(url, relPath);

  try {
    const body = await response.body();
    await saveBuffer(relPath, body);
  } catch (err) {
    console.warn(`Skipped ${url}: ${err.message}`);
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function rewriteHtml(html) {
  let output = html;

  // Replace known absolute resource URLs with the local mirror path.
  for (const [url, relPath] of savedResources.entries()) {
    const local = browserPath(relPath);
    output = output.replace(new RegExp(escapeRegExp(url), 'g'), local);
    output = output.replace(new RegExp(escapeRegExp(url.replace(source.origin, '')), 'g'), local);
  }

  // Replace origin-only references.
  output = output.replace(new RegExp(escapeRegExp(source.origin), 'g'), '');

  // Remove crawler/noindex meta if the preview site had one.
  output = output.replace(/<meta[^>]+name=["']robots["'][^>]*>/gi, '');

  return output;
}

async function main() {
  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await fs.mkdir(OUT_DIR, { recursive: true });

  console.log(`Scraping: ${SOURCE_URL}`);
  console.log(`Output:   ${OUT_DIR}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1800 },
    deviceScaleFactor: 1,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0 Safari/537.36'
  });

  page.on('response', (response) => {
    pendingSaves.push(saveResponse(response));
  });

  await page.goto(SOURCE_URL, { waitUntil: 'networkidle', timeout: 120000 });
  await page.waitForTimeout(WAIT_MS);

  // Touch common lazy sections by scrolling down the whole page.
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 700;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 250);
    });
  });

  await page.waitForTimeout(WAIT_MS);
  await Promise.allSettled(pendingSaves);

  const html = rewriteHtml(await page.content());
  await saveBuffer('index.html', Buffer.from(html, 'utf8'));
  await saveBuffer('404.html', Buffer.from(html, 'utf8'));
  await saveBuffer('.nojekyll', Buffer.from('', 'utf8'));
  if (CUSTOM_DOMAIN) {
    await saveBuffer('CNAME', Buffer.from(`${CUSTOM_DOMAIN}\n`, 'utf8'));
  }

  await browser.close();

  console.log(`Saved ${savedResources.size} network resources.`);
  console.log('Done. Preview locally with: npm run serve');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
