#!/usr/bin/env node
// Renders a wallpaper page (spectrum-wave.html, kaki-bauhaus.html) to a seamless looping video,
// frame by frame, in headless Chromium.
//
//   npm install playwright && npx playwright install chromium
//   node render-video.cjs [--page spectrum-wave.html] [--width 3840] [--height 2160] [--fps 60]
//                         [--codec h264|hevc|h264,hevc] [--out dir]
//   (--frames 60 renders only the first 60 frames, for a quick test)
//
// Needs ffmpeg on the PATH. The page exposes window.wallpaper = { draw(t), LOOP }; one video is
// exactly LOOP seconds, so it repeats without a seam.

const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const opts = { page: 'spectrum-wave.html', width: 3840, height: 2160, fps: 60, codec: 'h264', out: '.', workers: 3, frames: 0 };
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i += 2) {
  const key = argv[i].replace(/^--/, '');
  if (!(key in opts)) throw new Error(`Unknown option --${key}`);
  opts[key] = typeof opts[key] === 'number' ? Number(argv[i + 1]) : argv[i + 1];
}
const codecs = opts.codec.split(',');
fs.mkdirSync(opts.out, { recursive: true });
const name = path.basename(opts.page, '.html');
const files = codecs.map(c => path.join(opts.out, `${name}-${opts.width}x${opts.height}-${opts.fps}fps-${c}.mp4`));

const CODECS = {
  // Plays in any player or wallpaper app.
  h264: ['-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', '-tag:v', 'avc1'],
  // 10-bit HEVC: smoother gradients and a smaller file; plays natively on macOS.
  hevc: ['-c:v', 'libx265', '-preset', 'slow', '-crf', '16', '-pix_fmt', 'yuv420p10le', '-tag:v', 'hvc1',
         '-x265-params', 'log-level=error'],
};

(async () => {
  const unknown = codecs.find(c => !CODECS[c]);
  if (unknown) throw new Error(`Unknown codec ${unknown}; use h264 and/or hevc`);
  const html = pathToFileURL(path.resolve(__dirname, opts.page)).href;
  const browser = await chromium.launch();
  const pages = await Promise.all(Array.from({ length: opts.workers }, async () => {
    const page = await browser.newPage({ viewport: { width: opts.width, height: opts.height }, deviceScaleFactor: 1 });
    await page.addInitScript(() => { window.__WALLPAPER_RENDER__ = true; });
    await page.goto(html);
    return page;
  }));
  const loop = await pages[0].evaluate(() => window.wallpaper.LOOP);
  const frames = opts.frames || Math.round(loop * opts.fps);

  // One ffmpeg process, one output per codec, all fed from the same rendered frames.
  const ffmpeg = spawn('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(opts.fps), '-c:v', 'png', '-i', '-',
    ...codecs.flatMap((c, i) => [...CODECS[c], '-r', String(opts.fps), '-movflags', '+faststart', files[i]]),
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((resolve, reject) => ffmpeg.on('close', code => code ? reject(new Error(`ffmpeg exited ${code}`)) : resolve()));

  const render = (page, f) => page.evaluate(t => window.wallpaper.draw(t), f / opts.fps)
    .then(() => page.screenshot({ type: 'png' }));

  const started = Date.now();
  for (let f = 0; f < frames; f += pages.length) {
    const batch = pages.map((page, i) => f + i < frames ? render(page, f + i) : null).filter(Boolean);
    for (const png of await Promise.all(batch)) {
      if (!ffmpeg.stdin.write(png)) await new Promise(r => ffmpeg.stdin.once('drain', r));
    }
    const n = Math.min(f + pages.length, frames);
    const eta = ((Date.now() - started) / n) * (frames - n) / 1000;
    process.stdout.write(`\rframe ${n}/${frames}  eta ${Math.round(eta)}s   `);
  }
  ffmpeg.stdin.end();
  await done;
  await browser.close();
  console.log(`\nwrote ${files.join(', ')} (${frames} frames, ${loop}s loop)`);
})().catch(err => { console.error(err); process.exit(1); });
