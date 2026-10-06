import Navbar from "@/components/Navbar";
import DebugDock from "@/components/DebugDock";
import Hero from "@/components/Hero";
import PrincipleMarquee from "@/components/PrincipleMarquee";
import MadeForCycle from "@/components/MadeForCycle";
import About from "@/components/About";
import Team from "@/components/Team";
import Achievements from "@/components/Achievements";
import Sponsorship from "@/components/Sponsorship";
import CtaBanner from "@/components/CtaBanner";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative z-10 flex flex-1 flex-col">
      <Navbar />
      <DebugDock />
      <main className="flex-1">
        <Hero />
        <PrincipleMarquee />
        <MadeForCycle />
        <About />
        <Team />
        <Achievements />
        <Sponsorship />
        <CtaBanner />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
