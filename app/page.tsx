import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Problem } from "./components/Problem";
import { HowItWorks } from "./components/HowItWorks";
import { Differentiator } from "./components/Differentiator";
import { DemoSection } from "./components/DemoSection";
import { CTASection } from "./components/CTASection";
import { Footer } from "./components/Footer";
import { CosmicBackground } from "./components/CosmicBackground";

export default function Home() {
  return (
    <>
      <CosmicBackground />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Problem />
          <HowItWorks />
          <Differentiator />
          <DemoSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
}
