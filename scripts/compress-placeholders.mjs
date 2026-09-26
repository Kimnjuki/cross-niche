import { readFile, writeFile, stat } from 'node:fs/promises';

const MAX_WIDTH = 1600;
const TARGET_QUALITY = 78;
// Host drops files above ~4 MB on deploy; stay far under that.
const MAX_BYTES = 1_500_000;

const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('Usage: node scripts/compress-placeholders.mjs <image...>');
  process.exit(1);
}

const { default: sharp } = await import('sharp');

for (const file of files) {
  const before = (await stat(file)).size;
  const input = await readFile(file);
  let quality = TARGET_QUALITY;
  let output;
  // Shrink quality first, then dimensions if still too large.
  for (;;) {
    output = await sharp(input, { failOn: 'none' })
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toBuffer();
    if (output.length <= MAX_BYTES || quality <= 55) break;
    quality -= 8;
  }
  if (output.length >= before) {
    console.log(`${file}: already optimal (${before} B), skipping`);
    continue;
  }
  await writeFile(file, output);
  console.log(
    `${file}: ${(before / 1024).toFixed(0)} KB -> ${(output.length / 1024).toFixed(0)} KB (quality ${quality})`
  );
}
