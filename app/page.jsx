import Header from "./_components/Header";
import Hero from "./_components/Hero";
import UploadFile from "./_components/file-upload/_components/UploadFile";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen dark:bg-black">
      <Header/>
      <Hero/>
      <UploadFile/>
    </main>
  );
}
