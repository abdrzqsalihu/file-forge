import { Rubik, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const rubik = Rubik({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "File Forge",
  description:
    "Turn any image into exactly the format you need. Fast, private, browser-based conversion — nothing ever leaves your device.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${rubik.className} ${rubik.variable} ${jetbrainsMono.variable} bg-white text-secondary dark:bg-ink dark:text-gray-100 transition-colors`}
      >
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="grain" aria-hidden="true" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
