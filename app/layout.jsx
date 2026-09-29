import { Rubik, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const rubik = Rubik({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const siteUrl = "https://file-forge.vercel.app";
const title = "File Forge";
const description =
  "Turn any image into exactly the format you need. Fast, private, browser-based conversion, nothing ever leaves your device.";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: title,
    type: "website",
    images: [
      {
        url: "/social/file-forge-share.png",
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/social/file-forge-share.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${rubik.className} ${rubik.variable} ${jetbrainsMono.variable} bg-white text-secondary dark:bg-ink dark:text-gray-100 transition-colors`}
      > 
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="grain" aria-hidden="true" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
