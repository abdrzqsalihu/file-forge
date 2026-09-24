import jsPDF from "jspdf";

export const MAX_FILE_SIZE = 40 * 1024 * 1024; // 40MB — a large HEIC/TIFF decodes to a
// much bigger in-memory RGBA buffer than its file size, so this stays well
// under what browser tabs tend to tolerate before running out of memory.

function getExtension(file) {
  return file.name.split(".").pop().toLowerCase();
}

function kindForExtension(ext) {
  if (ext === "tif" || ext === "tiff") return "tiff";
  if (ext === "heic" || ext === "heif") return "heic";
  return "native";
}

function loadNativeImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => resolve({ img, url });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read this image."));
    };
    img.src = url;
  });
}

function canvasFromImage(img) {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  canvas.getContext("2d").drawImage(img, 0, 0);
  return canvas;
}

async function decodeHeic(file) {
  const heic2any = (await import("heic2any")).default;
  // heic2any returns an array for multi-image HEIC containers (rare for
  // photos) — we only ever convert the primary image.
  const result = await heic2any({ blob: file, toType: "image/png" });
  const pngBlob = Array.isArray(result) ? result[0] : result;
  const { img, url } = await loadNativeImage(pngBlob);
  const canvas = canvasFromImage(img);
  URL.revokeObjectURL(url);
  return canvas;
}

async function decodeTiff(file) {
  const UTIF = (await import("utif")).default;
  const buffer = await file.arrayBuffer();
  const ifds = UTIF.decode(buffer);
  if (!ifds.length) throw new Error("This TIFF file couldn't be read.");
  const page = ifds[0];
  UTIF.decodeImage(buffer, page);
  const rgba = UTIF.toRGBA8(page);

  const canvas = document.createElement("canvas");
  canvas.width = page.width;
  canvas.height = page.height;
  canvas
    .getContext("2d")
    .putImageData(
      new ImageData(new Uint8ClampedArray(rgba), page.width, page.height),
      0,
      0
    );
  return canvas;
}

async function decodeNative(file) {
  const { img, url } = await loadNativeImage(file);
  const canvas = canvasFromImage(img);
  URL.revokeObjectURL(url);
  return canvas;
}

// Decoding is the expensive step for HEIC/TIFF (a real WASM/JS decode, not
// just an <img> load), and the UI reads dimensions before the user commits
// to a conversion — cache the decoded canvas per file so we never pay that
// cost twice for the same upload.
const decodeCache = new WeakMap();

function decodeToCanvas(file) {
  if (decodeCache.has(file)) return decodeCache.get(file);

  if (file.size > MAX_FILE_SIZE) {
    return Promise.reject(
      new Error("That file is too large to convert in the browser (40MB max).")
    );
  }

  const kind = kindForExtension(getExtension(file));
  const decoder = kind === "heic" ? decodeHeic : kind === "tiff" ? decodeTiff : decodeNative;

  const promise = decoder(file).catch((err) => {
    decodeCache.delete(file);
    throw err;
  });
  decodeCache.set(file, promise);
  return promise;
}

export async function readImageDimensions(file) {
  const canvas = await decodeToCanvas(file);
  return { width: canvas.width, height: canvas.height };
}

function canvasToBlob(canvas, mime, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Conversion failed."))),
      mime,
      quality
    );
  });
}

async function encodeRaster(canvas, format, quality) {
  const blob = await canvasToBlob(canvas, format.mime, quality);
  // Some browsers (Firefox/Safari with AVIF, for example) silently hand
  // back a PNG instead of the format that was actually asked for, rather
  // than throwing. Catch that here instead of shipping a mislabeled file.
  if (blob.type !== format.mime) {
    throw new Error(`Your browser can't export ${format.label} yet.`);
  }
  return blob;
}

async function encodeGif(canvas) {
  const { GIFEncoder, quantize, applyPalette } = await import("gifenc");
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  const { data } = ctx.getImageData(0, 0, width, height);

  const palette = quantize(data, 256);
  const index = applyPalette(data, palette);

  const gif = GIFEncoder();
  gif.writeFrame(index, width, height, { palette });
  gif.finish();

  return new Blob([gif.bytes()], { type: "image/gif" });
}

// BMP has no browser encoder, but the format itself is simple enough to
// write by hand: a 40-byte BITMAPINFOHEADER followed by uncompressed
// 32-bit BGRA rows, bottom row first.
function encodeBmp(canvas) {
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  const { data } = ctx.getImageData(0, 0, width, height);

  const pixelArraySize = width * height * 4;
  const fileSize = 54 + pixelArraySize;
  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  view.setUint8(0, 0x42); // "B"
  view.setUint8(1, 0x4d); // "M"
  view.setUint32(2, fileSize, true);
  view.setUint32(10, 54, true); // pixel data offset

  view.setUint32(14, 40, true); // BITMAPINFOHEADER size
  view.setInt32(18, width, true);
  view.setInt32(22, height, true);
  view.setUint16(26, 1, true); // color planes
  view.setUint16(28, 32, true); // bits per pixel
  view.setUint32(30, 0, true); // BI_RGB, no compression
  view.setUint32(34, pixelArraySize, true);

  let offset = 54;
  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      view.setUint8(offset++, data[i + 2]); // B
      view.setUint8(offset++, data[i + 1]); // G
      view.setUint8(offset++, data[i]); // R
      view.setUint8(offset++, data[i + 3]); // A
    }
  }

  return new Blob([buffer], { type: "image/bmp" });
}

// A modern .ico is just a small directory header wrapping one or more PNGs
// — no library needed. Icons are conventionally capped at 256×256, so a
// larger source is downscaled to fit rather than producing an oversized,
// unconventional icon.
async function encodeIco(canvas) {
  const maxSize = 256;
  let iconCanvas = canvas;

  if (canvas.width > maxSize || canvas.height > maxSize) {
    const scale = Math.min(maxSize / canvas.width, maxSize / canvas.height);
    iconCanvas = document.createElement("canvas");
    iconCanvas.width = Math.round(canvas.width * scale);
    iconCanvas.height = Math.round(canvas.height * scale);
    iconCanvas
      .getContext("2d")
      .drawImage(canvas, 0, 0, iconCanvas.width, iconCanvas.height);
  }

  const pngBytes = new Uint8Array(
    await (await canvasToBlob(iconCanvas, "image/png")).arrayBuffer()
  );

  const header = new ArrayBuffer(22);
  const view = new DataView(header);
  view.setUint16(2, 1, true); // type: icon
  view.setUint16(4, 1, true); // one image
  view.setUint8(6, iconCanvas.width >= 256 ? 0 : iconCanvas.width);
  view.setUint8(7, iconCanvas.height >= 256 ? 0 : iconCanvas.height);
  view.setUint16(10, 1, true); // color planes
  view.setUint16(12, 32, true); // bits per pixel
  view.setUint32(14, pngBytes.byteLength, true);
  view.setUint32(18, 22, true); // offset to image data

  return new Blob([header, pngBytes], { type: "image/x-icon" });
}

async function encodePdf(canvas, file) {
  const aspectRatio = canvas.width / canvas.height;
  const maxWidthMm = 350;
  const maxHeightMm = 400;

  let widthMm = canvas.width;
  let heightMm = canvas.height;
  if (widthMm > maxWidthMm) {
    widthMm = maxWidthMm;
    heightMm = widthMm / aspectRatio;
  }
  if (heightMm > maxHeightMm) {
    heightMm = maxHeightMm;
    widthMm = heightMm * aspectRatio;
  }

  const pdf = new jsPDF({
    orientation: widthMm > heightMm ? "l" : "p",
    unit: "mm",
    format: [widthMm, heightMm],
  });

  const imgData = canvas.toDataURL("image/jpeg", 1.0);
  pdf.addImage(imgData, "JPEG", 0, 0, widthMm, heightMm);

  const pdfBlob = pdf.output("blob");
  return new File([pdfBlob], file.name.replace(/\.[^.]+$/, ".pdf"), {
    type: "application/pdf",
  });
}

function toFile(blob, name, mime) {
  return new File([blob], name, { type: mime });
}

// Single entry point the UI calls. targetId is one of the SUPPORTED_FORMATS
// ids from ContentConstant.js ("png" | "jpg" | "webp" | "gif" | "bmp" |
// "avif" | "ico" | "pdf"). quality (0–1) only matters for jpg/webp.
export async function convertTo(file, targetId, { quality } = {}) {
  const canvas = await decodeToCanvas(file);
  const withExt = (ext) => file.name.replace(/\.[^.]+$/, `.${ext}`);

  switch (targetId) {
    case "png":
      return toFile(
        await encodeRaster(canvas, { mime: "image/png", label: "PNG" }),
        withExt("png"),
        "image/png"
      );
    case "jpg":
      return toFile(
        await encodeRaster(canvas, { mime: "image/jpeg", label: "JPG" }, quality ?? 0.92),
        withExt("jpg"),
        "image/jpeg"
      );
    case "webp":
      return toFile(
        await encodeRaster(canvas, { mime: "image/webp", label: "WEBP" }, quality ?? 0.92),
        withExt("webp"),
        "image/webp"
      );
    case "avif":
      return toFile(
        await encodeRaster(canvas, { mime: "image/avif", label: "AVIF" }),
        withExt("avif"),
        "image/avif"
      );
    case "gif":
      return toFile(await encodeGif(canvas), withExt("gif"), "image/gif");
    case "bmp":
      return toFile(encodeBmp(canvas), withExt("bmp"), "image/bmp");
    case "ico":
      return toFile(await encodeIco(canvas), withExt("ico"), "image/x-icon");
    case "pdf":
      return encodePdf(canvas, file);
    default:
      throw new Error(`Unsupported target format: ${targetId}`);
  }
}

// AVIF encoding via canvas is currently Chromium-only (Chrome/Edge 124+) —
// Firefox and Safari can decode AVIF but not produce it, and silently
// substitute a PNG instead of failing loudly. Feature-detect once, on the
// real browser, before ever offering AVIF as a target.
let avifSupportPromise = null;
export function checkAvifEncodeSupport() {
  if (avifSupportPromise) return avifSupportPromise;
  avifSupportPromise = new Promise((resolve) => {
    if (typeof document === "undefined") {
      resolve(false);
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    try {
      canvas.toBlob(
        (blob) => resolve(!!blob && blob.type === "image/avif"),
        "image/avif"
      );
    } catch {
      resolve(false);
    }
  });
  return avifSupportPromise;
}
