import Header from "./_components/Header";
import Hero from "./_components/Hero";
import UploadFile from "./_components/file-upload/_components/UploadFile";
import FormatShowcase from "./_components/FormatShowcase";
import WhyFileForge from "./_components/WhyFileForge";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <UploadFile />
      <FormatShowcase />
      <WhyFileForge />
      <Footer />
    </main>
  );
}
