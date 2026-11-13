import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Gatekeeper, Envelope, Memories, CakeScreen, Letter, CassettePlayer } from "@/components/birthday/Screens";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday Angel 💗" },
      { name: "description", content: "A little birthday surprise made with love for Angel." },
      { property: "og:title", content: "Happy Birthday Angel 💗" },
      { property: "og:description", content: "A little birthday surprise made with love for Angel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [step, setStep] = useState(0);
  const next = () => setStep((s) => s + 1);
  const screens = [<Gatekeeper onYes={next} />, <Envelope onOpen={next} />, <Memories onNext={next} />, <CakeScreen onLetter={next} />, <Letter />];
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <CassettePlayer />
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.65 }} className="w-full">
          {screens[step]}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
