// Navigation links
export const navLinks = [
  {
    id: "#converter",
    title: "Convert",
  },
  {
    id: "#formats",
    title: "Formats",
  },
  {
    id: "#why",
    title: "Why File Forge",
  },
];

// Formats File Forge can read as input. "kind" tells the decoder in
// convertFile.js which pipeline to use:
//   native — the browser decodes it directly via <img>/<canvas>
//   tiff   — decoded with UTIF.js (no browser can read TIFF natively)
//   heic   — decoded with heic2any, a WASM build of libheif (no browser
//            can read HEIC/HEIF natively either)
export const INPUT_FORMATS = [
  { ext: "png", label: "PNG", kind: "native" },
  { ext: "jpg", label: "JPG", kind: "native" },
  { ext: "jpeg", label: "JPEG", kind: "native" },
  { ext: "webp", label: "WEBP", kind: "native" },
  { ext: "gif", label: "GIF", kind: "native" },
  { ext: "bmp", label: "BMP", kind: "native" },
  { ext: "avif", label: "AVIF", kind: "native" },
  { ext: "svg", label: "SVG", kind: "native" },
  { ext: "tif", label: "TIFF", kind: "tiff" },
  { ext: "tiff", label: "TIFF", kind: "tiff" },
  { ext: "heic", label: "HEIC", kind: "heic" },
  { ext: "heif", label: "HEIC", kind: "heic" },
];

export const ACCEPTED_SOURCE_EXTENSIONS = INPUT_FORMATS.map((f) => f.ext);

// The MIME-type hint for the native file picker. It's only ever a hint —
// actual validation is by extension — so unusual types being ignored by
// some OS pickers isn't a problem.
export const ACCEPTED_SOURCE_MIME = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/avif",
  "image/svg+xml",
  "image/tiff",
  "image/heic",
  "image/heif",
].join(",");

// Formats File Forge can genuinely produce, grouped for the format picker.
// Every entry here is a real, verified browser (or hand-rolled) encoder —
// nothing on this list is simulated.
//   quality            — lossy formats where a quality slider is worth showing
//   requiresRuntimeCheck — only offer this once we've confirmed the running
//                          browser can actually encode it (see checkAvifEncodeSupport
//                          in convertFile.js); Firefox/Safari silently hand back
//                          a mislabeled PNG instead of throwing, so we check first
export const SUPPORTED_FORMATS = [
  { id: "png", label: "PNG", ext: "png", mime: "image/png", category: "Raster" },
  { id: "jpg", label: "JPG", ext: "jpg", mime: "image/jpeg", category: "Raster", quality: true },
  { id: "webp", label: "WEBP", ext: "webp", mime: "image/webp", category: "Raster", quality: true },
  { id: "gif", label: "GIF", ext: "gif", mime: "image/gif", category: "Raster" },
  { id: "bmp", label: "BMP", ext: "bmp", mime: "image/bmp", category: "Raster" },
  {
    id: "avif",
    label: "AVIF",
    ext: "avif",
    mime: "image/avif",
    category: "Modern",
    requiresRuntimeCheck: true,
  },
  { id: "ico", label: "ICO", ext: "ico", mime: "image/x-icon", category: "Other" },
  { id: "pdf", label: "PDF", ext: "pdf", mime: "application/pdf", category: "Other" },
];

export const FORMAT_CATEGORY_ORDER = ["Raster", "Modern", "Other"];

export const benefits = [
  {
    title: "Runs in your browser",
    description:
      "Conversion happens on your device with the Canvas API. Your images are never uploaded to a server.",
  },
  {
    title: "No format guesswork",
    description:
      "Pick a target format from the options that actually make sense for your file — nothing else to configure.",
  },
  {
    title: "Straight to download",
    description:
      "Convert once, download once. No accounts, no queues, no watermarks.",
  },
];
