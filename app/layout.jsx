import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: "500", // Specify desired weight
  family: "Poppins",
});

export const metadata = {
  title: "File Forge",
  description:
    "Experience seamless file conversion with convenience and reliability.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
