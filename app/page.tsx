import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import AutomationBento from "@/components/AutomationBento";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative" style={{ zIndex: 10 }}>
      <Navbar />
      <Hero />
      <About />
      <AutomationBento />
      <Footer />
    </main>
  );
}
