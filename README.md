# File Forge

Convert an image to the format you need, entirely in the browser.

**Live:** https://file-forge.vercel.app/

File Forge is a single-purpose image converter built with Next.js. You drop in an image, pick a target format, and download the result. There is no backend: decoding and encoding happen on your device using the Canvas API, plus a few small client-side libraries for formats browsers can't handle natively.

## Features

- **10 input formats, 8 output formats** — see [Supported formats](#supported-formats).
- **Fully client-side conversion.** The repository contains no server, API routes, or upload logic.
- **Drag-and-drop with a keyboard-accessible alternative.** The drop zone is also a focusable button that opens the native file picker.
- **Only sensible targets are offered.** Converting a file to its own format is never listed (`jpg` and `jpeg` are treated as the same format).
- **Quality control where it matters.** A quality slider appears only for the lossy targets (JPG, WEBP).
- **Capability-checked AVIF export.** AVIF is only offered if the running browser can actually encode it.
- **Light/dark theme** with a circular reveal transition (View Transitions API, with an instant-swap fallback).
- **Respects `prefers-reduced-motion`.**

## Supported formats

### Input

| Format | Extensions | How it's decoded |
| --- | --- | --- |
| PNG, JPG, WEBP, GIF, BMP, AVIF, SVG | `.png` `.jpg` `.jpeg` `.webp` `.gif` `.bmp` `.avif` `.svg` | Natively by the browser (`<img>` → `<canvas>`) |
| TIFF | `.tif` `.tiff` | [`utif`](https://github.com/photopea/UTIF.js) (pure JS) |
| HEIC / HEIF | `.heic` `.heif` | [`heic2any`](https://github.com/alexcorvi/heic2any) (WASM build of libheif) |

### Output

| Format | How it's encoded |
| --- | --- |
| PNG, JPG, WEBP | `canvas.toBlob()` |
| AVIF | `canvas.toBlob()` — Chromium only, feature-detected at runtime |
| GIF | [`gifenc`](https://github.com/mattdesl/gifenc) — single frame, 256-colour palette |
| BMP | Hand-written encoder — uncompressed 32-bit BGRA |
| ICO | Hand-written encoder — a single PNG wrapped in an ICO header, downscaled to fit 256×256 if larger |
| PDF | [`jspdf`](https://github.com/parallax/jsPDF) — one page sized to the image (max 350×400 mm), image embedded as JPEG |

SVG, TIFF and HEIC are input-only on purpose: converting a raster image *to* SVG would just wrap pixels rather than vectorize them, and there is no reliable client-side encoder for TIFF or HEIC. ICO and PDF are output-only.

## How conversion works

All conversion logic lives in [`app/utils/convertFile.js`](app/utils/convertFile.js).

1. **Decode once.** `decodeToCanvas(file)` picks a decoder by file extension (native, TIFF, or HEIC) and draws the result onto a `<canvas>` at the image's natural size. The decoded canvas is cached per `File` (in a `WeakMap`) so the UI can read dimensions on upload without paying for a second HEIC/TIFF decode when the user converts.
2. **Encode from the canvas.** `convertTo(file, targetId, { quality })` routes to the encoder for the chosen format. All encoders read from the same decoded canvas.
3. **Guard against silent fallbacks.** When a browser can't encode a requested MIME type, `canvas.toBlob()` returns a PNG instead of failing. `encodeRaster` compares the returned blob's type to what was requested and throws if they differ, so a mislabelled file is never handed to the user.
4. **Lazy-load the heavy parts.** `heic2any`, `utif` and `gifenc` are loaded with dynamic `import()`, so their cost is only paid when a HEIC/TIFF file is uploaded or GIF is chosen as the target.

### Behaviour worth knowing

- **Dimensions** are preserved, except ICO (capped at 256×256).
- **Metadata (EXIF, etc.) is not preserved** — images are re-encoded from pixel data.
- **Animation is not preserved.** Animated GIFs, multi-page TIFFs and multi-image HEIC containers are converted from a single frame/page/image, and GIF output is always a single frame.
- **Transparency** survives PNG, WEBP, GIF, BMP, AVIF and ICO output. JPG and PDF (which embeds a JPEG) have no alpha channel; transparent areas are not flattened onto a background colour, so they render as black.
- **JPG/WEBP quality** defaults to 0.92 and is adjustable from 0.4 to 1.0.
- **File size limit:** 40 MB per file, checked on selection. Large HEIC/TIFF files decode to a much larger in-memory buffer than their file size, so this keeps tabs from running out of memory.

## Privacy

Files are read and converted in browser memory. Nothing in this repository uploads an image anywhere, there is no backend code at all. The conversion libraries are part of the site's own JavaScript bundle (loaded on demand), not fetched from a third-party service.

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router) and React 18
- [Tailwind CSS 3](https://tailwindcss.com/) for styling
- [next-themes](https://github.com/pacocoursey/next-themes) for light/dark mode (class strategy; follows the system preference until the user picks a theme, then remembers that choice)
- [lucide-react](https://lucide.dev/) for icons
- Fonts via `next/font`: Rubik and JetBrains Mono
- Conversion libraries: `jspdf`, `gifenc`, `heic2any`, `utif`

## Project structure

```
app/
├── layout.jsx                 # Fonts, theme provider, metadata
├── page.jsx                   # Page composition
├── globals.css                # Keyframes, focus styles, view-transition + reduced-motion rules
├── constants/
│   └── ContentConstant.js     # Nav links, input/output format definitions, copy
├── utils/
│   └── convertFile.js         # Decoders, encoders, AVIF capability check
└── _components/
    ├── Header.jsx, Hero.jsx, FormatShowcase.jsx, WhyFileForge.jsx, Footer.jsx
    ├── ThemeToggle.jsx        # Theme button + circular-reveal transition
    ├── Logo.jsx, FlowArrow.jsx
    └── file-upload/_components/
        ├── UploadFile.jsx     # Drop zone, validation, drag state
        ├── FilePreview.jsx    # Format picker, quality slider, progress, result
        └── Button.jsx         # Convert / download / reset actions
```

The supported formats are defined in one place, `app/constants/ContentConstant.js` (`INPUT_FORMATS`, `SUPPORTED_FORMATS`). The upload validation, the format picker and the landing-page format list all read from it, so keep it in sync with `convertFile.js` when adding a format.

## Getting started

### Prerequisites

- Node.js 18.17 or later (required by Next.js 14)
- [pnpm](https://pnpm.io/) — the repository ships a `pnpm-lock.yaml`

### Install and run

```bash
pnpm install
pnpm dev
```

Then open http://localhost:3000.

### Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run `next lint` (no ESLint config is committed yet) |

### Environment variables

None. The app has no backend and needs no configuration.

## Browser considerations

- **AVIF export requires a Chromium-based browser** (Chrome/Edge 124+ at the time of writing). Firefox and Safari can read AVIF but can't encode it via canvas, so the AVIF option is hidden there.
- **WEBP export** depends on the browser's canvas encoder; if it can't produce WEBP, the conversion fails with a clear error instead of returning a mislabelled file.
- **HEIC decoding** loads a WASM decoder on first use, so the first HEIC conversion is slower than later ones.
- **The theme transition** uses `document.startViewTransition()`. Browsers without it (and users with reduced motion enabled) get an instant theme swap instead.
- **Very large images** are limited by browser memory rather than only by file size.

## Contributing

Issues and pull requests are welcome. For code changes:

1. Fork the repository and create a branch.
2. Keep changes focused, and match the existing code style.
3. If you add or change a format, update `ContentConstant.js`, `convertFile.js` and this README together.
4. Test conversions manually in the browser — there is no automated test suite yet.

## License

No license file is currently included in this repository.

## Author

Built by [Abdulrazaq Salihu](https://abdrzaqsalihu.space/).
