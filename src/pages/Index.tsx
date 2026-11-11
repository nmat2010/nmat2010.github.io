import { Suspense, lazy, useEffect, useState } from "react";
import { Navigation } from "@/components/view/Navigation";
import { ViewHero } from "@/components/view/ViewHero";
import { AboutSection } from "@/components/view/AboutSection";
import { ExperienceSection } from "@/components/view/ExperienceSection";
import { WorkSection } from "@/components/view/WorkSection";
import { ContactSection } from "@/components/view/ContactSection";
import { Footer } from "@/components/view/Footer";
import { ModeGate } from "@/components/ModeGate";

const PlayMode = lazy(() => import("@/play/PlayMode"));

type Mode = "gate" | "play" | "view";

const fromUrl = (): Mode => {
  const m = new URLSearchParams(window.location.search).get("mode");
  return m === "play" || m === "view" ? m : "gate";
};

const Index = () => {
  const [mode, setMode] = useState<Mode>(fromUrl);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (mode === "gate") url.searchParams.delete("mode");
    else url.searchParams.set("mode", mode);
    window.history.replaceState(null, "", url);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [mode]);

  if (mode === "gate") return <ModeGate onChoose={setMode} />;

  if (mode === "play") {
    return (
      <Suspense fallback={<div className="fixed inset-0 bg-background" />}>
        <PlayMode onExit={() => setMode("view")} onHome={() => setMode("gate")} />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation onPlay={() => setMode("play")} onHome={() => setMode("gate")} />
      <main>
        <ViewHero onPlay={() => setMode("play")} />
        <AboutSection />
        <ExperienceSection />
        <WorkSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
