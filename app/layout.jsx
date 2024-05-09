import { Rubik } from "next/font/google";
import "./globals.css";

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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={rubik.className}>{children}</body>
    </html>
  );
}
