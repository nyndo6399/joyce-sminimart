/**
 * Joyce's Mini Mart - Client-Side HTML5 Canvas Background Remover
 * Runs in the browser using 2D Canvas getImageData / putImageData.
 * Uses border-seeded flood fill (BFS), automatic transparency detection,
 * checkerboard/off-white/chroma removal, soft alpha feathering, and tight auto-crop.
 */

export interface RemovalOptions {
  mode: 'white' | 'color';
  // Brightness / luminance threshold for light/white background detection (150 to 255)
  whiteThreshold: number;
  // Key color to remove in color mode
  keyColor: { r: number; g: number; b: number };
  // Color distance tolerance (0 to 100)
  tolerance: number;
  // Feather edge radius in pixels (0 to 3) for smooth anti-aliased cutout
  feather: number;
}

export const defaultRemovalOptions: RemovalOptions = {
  mode: 'white',
  whiteThreshold: 232,
  keyColor: { r: 255, g: 255, b: 255 },
  tolerance: 34,
  feather: 1,
};

/**
 * Loads an image from a File or URL into an HTMLImageElement.
 */
export function loadImage(src: string | File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (typeof src === 'string' && !src.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);

    if (src instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(src);
    } else {
      img.src = src;
    }
  });
}

/**
 * Loads an image from a File, data URL, or external http(s) URL so canvas pixels can ALWAYS be read.
 * If direct crossOrigin loading fails due to CORS, falls back to same-origin /api/image-proxy.
 */
export async function loadEditableImage(
  src: string | File
): Promise<{ img: HTMLImageElement; usedProxy: boolean }> {
  if (src instanceof File || src.startsWith('data:') || src.startsWith('/')) {
    const img = await loadImage(src);
    return { img, usedProxy: false };
  }

  // Try direct CORS load first
  try {
    const img = await loadImage(src);
    // Test pixel read to verify canvas is not tainted
    const testCanvas = document.createElement('canvas');
    testCanvas.width = 2;
    testCanvas.height = 2;
    const tctx = testCanvas.getContext('2d');
    if (tctx) {
      tctx.drawImage(img, 0, 0, 2, 2);
      tctx.getImageData(0, 0, 1, 1);
    }
    return { img, usedProxy: false };
  } catch {
    // Fallback to same-origin proxy
    const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(src)}`;
    const img = await loadImage(proxyUrl);
    return { img, usedProxy: true };
  }
}

/**
 * Checks whether the outer border/corners of an image already have transparent pixels.
 */
export function hasTransparentBorder(img: HTMLImageElement): boolean {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return false;

  const w = Math.min(img.width || 1, 160);
  const h = Math.min(img.height || 1, 160);
  canvas.width = w;
  canvas.height = h;
  ctx.drawImage(img, 0, 0, w, h);

  const data = ctx.getImageData(0, 0, w, h).data;
  let borderCount = 0;
  let transparentCount = 0;

  for (let x = 0; x < w; x++) {
    borderCount += 2;
    if (data[x * 4 + 3] < 200) transparentCount++;
    if (data[((h - 1) * w + x) * 4 + 3] < 200) transparentCount++;
  }
  for (let y = 1; y < h - 1; y++) {
    borderCount += 2;
    if (data[y * w * 4 + 3] < 200) transparentCount++;
    if (data[(y * w + (w - 1)) * 4 + 3] < 200) transparentCount++;
  }

  return borderCount > 0 && transparentCount / borderCount >= 0.25;
}

/**
 * Samples the opaque perimeter pixels of an image to detect the dominant background color.
 */
export function detectBackgroundColor(
  img: HTMLImageElement
): { r: number; g: number; b: number } {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return { r: 255, g: 255, b: 255 };

  const w = Math.min(img.width || 1, 200);
  const h = Math.min(img.height || 1, 200);
  canvas.width = w;
  canvas.height = h;
  ctx.drawImage(img, 0, 0, w, h);

  const data = ctx.getImageData(0, 0, w, h).data;
  const samples: { r: number; g: number; b: number }[] = [];

  const pushIfOpaque = (idx: number) => {
    if (data[idx + 3] >= 200) {
      samples.push({ r: data[idx], g: data[idx + 1], b: data[idx + 2] });
    }
  };

  for (let x = 0; x < w; x += 2) {
    pushIfOpaque(x * 4);
    pushIfOpaque(((h - 1) * w + x) * 4);
  }
  for (let y = 1; y < h - 1; y += 2) {
    pushIfOpaque(y * w * 4);
    pushIfOpaque((y * w + (w - 1)) * 4);
  }

  if (samples.length === 0) {
    return { r: 255, g: 255, b: 255 };
  }

  // Bucket colors by 16-step quantization to find the dominant perimeter background cluster
  const buckets = new Map<
    string,
    { count: number; sumR: number; sumG: number; sumB: number }
  >();
  for (const s of samples) {
    const key = `${s.r >> 4}-${s.g >> 4}-${s.b >> 4}`;
    const entry = buckets.get(key) || { count: 0, sumR: 0, sumG: 0, sumB: 0 };
    entry.count++;
    entry.sumR += s.r;
    entry.sumG += s.g;
    entry.sumB += s.b;
    buckets.set(key, entry);
  }

  let best = { count: 0, sumR: 255, sumG: 255, sumB: 255 };
  for (const entry of buckets.values()) {
    if (entry.count > best.count) {
      best = entry;
    }
  }

  return {
    r: Math.round(best.sumR / best.count),
    g: Math.round(best.sumG / best.count),
    b: Math.round(best.sumB / best.count),
  };
}

/**
 * Automatically chooses ideal background removal options for an image.
 */
export function detectAutoRemovalOptions(img: HTMLImageElement): RemovalOptions {
  const detectedColor = detectBackgroundColor(img);
  const maxC = Math.max(detectedColor.r, detectedColor.g, detectedColor.b);
  const minC = Math.min(detectedColor.r, detectedColor.g, detectedColor.b);
  const isNeutralLight = maxC >= 200 && maxC - minC <= 28;

  return {
    ...defaultRemovalOptions,
    mode: isNeutralLight ? 'white' : 'color',
    keyColor: detectedColor,
    whiteThreshold: isNeutralLight ? Math.min(238, Math.max(205, minC - 8)) : 232,
    tolerance: isNeutralLight ? 34 : 38,
    feather: 1,
  };
}

/**
 * Trims transparent margins around a canvas and returns a PNG data URL with a small ~3% padding.
 */
function exportTrimmedPng(
  canvas: HTMLCanvasElement,
  alphas: Uint8Array,
  width: number,
  height: number
): string {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * width;
    for (let x = 0; x < width; x++) {
      if (alphas[rowOffset + x] > 18) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX < minX || maxY < minY) {
    return canvas.toDataURL('image/png');
  }

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  const pad = Math.max(4, Math.round(Math.max(cropW, cropH) * 0.035));

  const outCanvas = document.createElement('canvas');
  outCanvas.width = cropW + pad * 2;
  outCanvas.height = cropH + pad * 2;
  const outCtx = outCanvas.getContext('2d');
  if (!outCtx) return canvas.toDataURL('image/png');

  outCtx.drawImage(canvas, minX, minY, cropW, cropH, pad, pad, cropW, cropH);
  return outCanvas.toDataURL('image/png');
}

/**
 * Processes the image on an offscreen canvas using border-connected flood fill (BFS)
 * so exterior solid/white/off-white/checkerboard backgrounds are cleanly removed while
 * white details INSIDE the item (milk, eyes, highlights) remain untouched.
 */
export function removeBackground(
  img: HTMLImageElement,
  options: RemovalOptions = defaultRemovalOptions,
  maxDimension = 512,
  preserveExistingTransparency = false
): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return '';

  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;
  if (!width || !height) return '';

  if (width > maxDimension || height > maxDimension) {
    if (width > height) {
      height = Math.max(1, Math.round((height * maxDimension) / width));
      width = maxDimension;
    } else {
      width = Math.max(1, Math.round((width * maxDimension) / height));
      height = maxDimension;
    }
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const totalPixels = width * height;
  const alphas = new Uint8Array(totalPixels);

  for (let i = 0; i < totalPixels; i++) {
    alphas[i] = data[i * 4 + 3];
  }

  if (preserveExistingTransparency) {
    return exportTrimmedPng(canvas, alphas, width, height);
  }

  const { mode, whiteThreshold, keyColor, tolerance, feather } = options;
  const tolDist = Math.max(12, tolerance * 2.55);
  const tolSq = tolDist * tolDist;

  // Detect if perimeter contains light neutral gray/white tones (e.g. baked checkerboard or off-white)
  const isBgPixel = (pixelIdx: number): boolean => {
    const off = pixelIdx * 4;
    const a = data[off + 3];
    if (a < 24) return true;

    const r = data[off];
    const g = data[off + 1];
    const b = data[off + 2];

    if (mode === 'white') {
      const maxVal = Math.max(r, g, b);
      const minVal = Math.min(r, g, b);
      const avg = (r + g + b) / 3;
      const chroma = maxVal - minVal;

      if (minVal >= whiteThreshold) return true;
      // Neutral off-white / light-gray / baked checkerboard light squares
      if (chroma <= 26 && avg >= whiteThreshold - 26) return true;
      // Also match pixels close to the sampled keyColor within tolerance
      const dr = r - keyColor.r;
      const dg = g - keyColor.g;
      const db = b - keyColor.b;
      if (dr * dr + dg * dg + db * db <= tolSq * 0.45 && avg >= 175) return true;
      return false;
    } else {
      const dr = r - keyColor.r;
      const dg = g - keyColor.g;
      const db = b - keyColor.b;
      return dr * dr + dg * dg + db * db <= tolSq;
    }
  };

  // Flood fill (BFS) seeded from all 4 outer borders so interior whites stay intact
  const visited = new Uint8Array(totalPixels);
  const isBg = new Uint8Array(totalPixels);
  const queue = new Int32Array(totalPixels);
  let head = 0;
  let tail = 0;

  const trySeed = (idx: number) => {
    if (visited[idx]) return;
    visited[idx] = 1;
    if (isBgPixel(idx)) {
      isBg[idx] = 1;
      queue[tail++] = idx;
    }
  };

  for (let x = 0; x < width; x++) {
    trySeed(x);
    trySeed((height - 1) * width + x);
  }
  for (let y = 1; y < height - 1; y++) {
    trySeed(y * width);
    trySeed(y * width + (width - 1));
  }

  while (head < tail) {
    const idx = queue[head++];
    const x = idx % width;
    const y = (idx - x) / width;

    if (x > 0) {
      const n = idx - 1;
      if (!visited[n]) {
        visited[n] = 1;
        if (isBgPixel(n)) {
          isBg[n] = 1;
          queue[tail++] = n;
        }
      }
    }
    if (x < width - 1) {
      const n = idx + 1;
      if (!visited[n]) {
        visited[n] = 1;
        if (isBgPixel(n)) {
          isBg[n] = 1;
          queue[tail++] = n;
        }
      }
    }
    if (y > 0) {
      const n = idx - width;
      if (!visited[n]) {
        visited[n] = 1;
        if (isBgPixel(n)) {
          isBg[n] = 1;
          queue[tail++] = n;
        }
      }
    }
    if (y < height - 1) {
      const n = idx + width;
      if (!visited[n]) {
        visited[n] = 1;
        if (isBgPixel(n)) {
          isBg[n] = 1;
          queue[tail++] = n;
        }
      }
    }
  }

  for (let i = 0; i < totalPixels; i++) {
    if (isBg[i]) {
      alphas[i] = 0;
    }
  }

  // Soft edge feathering + subtle halo decontamination on boundary pixels
  if (feather > 0) {
    const updatedAlphas = new Uint8Array(alphas);
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        if (alphas[idx] > 0) {
          let bgNeighbors = 0;
          if (isBg[idx - width]) bgNeighbors++;
          if (isBg[idx + width]) bgNeighbors++;
          if (isBg[idx - 1]) bgNeighbors++;
          if (isBg[idx + 1]) bgNeighbors++;

          if (bgNeighbors > 0) {
            const off = idx * 4;
            const r = data[off];
            const g = data[off + 1];
            const b = data[off + 2];
            const avg = (r + g + b) / 3;
            // Soften anti-aliased bright fringe touching transparent background
            if (mode === 'white' && avg >= whiteThreshold - 42 && Math.max(r, g, b) - Math.min(r, g, b) < 35) {
              updatedAlphas[idx] = Math.round(alphas[idx] * (feather >= 2 ? 0.35 : 0.55));
            } else if (bgNeighbors >= 2 && feather >= 2) {
              updatedAlphas[idx] = Math.round(alphas[idx] * 0.72);
            }
          }
        }
      }
    }
    for (let i = 0; i < totalPixels; i++) {
      alphas[i] = updatedAlphas[i];
    }
  }

  for (let i = 0; i < totalPixels; i++) {
    data[i * 4 + 3] = alphas[i];
  }

  ctx.putImageData(imageData, 0, 0);
  return exportTrimmedPng(canvas, alphas, width, height);
}

/**
 * Convenience pipeline: loads an image from File, URL, or data URL (using /api/image-proxy if CORS blocks)
 * and automatically strips any opaque background, returning a trimmed transparent PNG data URL.
 */
export async function autoRemoveBackgroundFromSource(
  src: string | File
): Promise<{ dataUrl: string; img: HTMLImageElement; options: RemovalOptions; alreadyTransparent: boolean }> {
  const { img } = await loadEditableImage(src);
  const alreadyTransparent = hasTransparentBorder(img);
  const options = detectAutoRemovalOptions(img);
  const dataUrl = removeBackground(img, options, 512, alreadyTransparent);
  return { dataUrl, img, options, alreadyTransparent };
}
