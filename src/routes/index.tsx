import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/iris/Nav";
import { Hero } from "@/components/iris/Hero";
import { ProblemSection } from "@/components/iris/ProblemSection";
import { VoiceSection } from "@/components/iris/VoiceSection";
import { ScaleSection } from "@/components/iris/ScaleSection";
import { TranscriptSection } from "@/components/iris/TranscriptSection";
import { CallbackSection } from "@/components/iris/CallbackSection";
import { IntegrationsSection } from "@/components/iris/IntegrationsSection";
import { CTASection } from "@/components/iris/CTASection";
import { Footer } from "@/components/iris/Footer";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="bg-white text-tesla-dark font-[family-name:var(--font-sans)] selection:bg-tesla-red selection:text-white">
      <Nav />
      <Hero />
      <ProblemSection />
      <VoiceSection />
      <ScaleSection />
      <TranscriptSection />
      <CallbackSection />
      <IntegrationsSection />
      <CTASection />
      <Footer />
    </main>
  );
}
