import { Rubik } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: "400", // Specify desired weight
//   family: "Poppins",
// });

const rubik = Rubik({ subsets: ["latin"] });

export const metadata = {
  title: "File Forge",
  description:
    "Experience seamless file conversion with convenience and reliability.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      {/* <ThemeProvider attribute="class"> */}

      <body className={rubik.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          // enableSystem
          // disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
