# File Forge

A simple, privacy-first image converter that runs entirely in your browser.

**Live:** https://file-forge.vercel.app/

Drop in an image, choose a format, and download the converted file. No uploads, no backend, and no accounts.

## Features

* Convert between common image formats
* Supports PNG, JPG, WEBP, GIF, BMP, AVIF, SVG, TIFF, and HEIC/HEIF
* Export to PNG, JPG, WEBP, GIF, BMP, AVIF, ICO, and PDF
* Drag-and-drop or file picker upload
* Adjustable quality for JPG and WEBP
* Light and dark themes
* Fully client-side conversion
* 40 MB file limit

## Privacy

Your files never leave your device. File Forge processes images directly in the browser using the Canvas API and client-side libraries.

There is no backend, upload service, or image storage.

## Tech Stack

* Next.js 14
* React 18
* Tailwind CSS
* JavaScript
* Canvas API
* jsPDF
* gifenc
* heic2any
* UTIF

## Getting Started

### Requirements

* Node.js 18.17+
* pnpm

### Installation

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000` in your browser.

### Available Scripts

```bash
pnpm dev       # Start development server
pnpm build     # Create production build
pnpm start     # Start production server
pnpm lint      # Run linting
```

## Notes

* AVIF export depends on browser support and is only shown when available.
* Animated images are converted from a single frame.
* Image metadata such as EXIF is not preserved.
* JPG and PDF do not support transparency.

## License

No license has been added to the repository yet.

## Author

Built by [Abdulrazaq Salihu](https://abdrzqsalihu.space/).
