import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimationFrame, useMotionValue } from "framer-motion";
import song from "@/assets/tum_hi_ho.mp3.asset.json";
import Confetti from "react-confetti";
import m1 from "@/assets/Untitled_design_2.webp.asset.json";
import m2 from "@/assets/Untitled_design_3.webp.asset.json";
import m3 from "@/assets/Your_paragraph_text.webp.asset.json";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

const btn = "min-h-14 min-w-32 rounded-full px-8 text-lg font-semibold transition-transform active:scale-95";

/* Every screen is its own scroll container, so the dock clearance lives here:
   pb-40 (10rem) is taller than the dock's scaled footprint (bottom-6 + widget). */
const screen = "fixed inset-0 overflow-y-auto pb-40";

export function Gatekeeper({ onYes }: { onYes: () => void }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const jump = () => {
    const w = typeof window !== "undefined" ? window.innerWidth : 360;
    const h = typeof window !== "undefined" ? window.innerHeight : 640;
    setPos({ x: (Math.random() - 0.5) * (w - 140), y: (Math.random() - 0.5) * (h * 0.55) });
  };
  return (
    <section className={`${screen} bg-prologue`}>
      <div className="prologue-frame" aria-hidden="true" />
      <div className="relative flex min-h-full flex-col items-center justify-center gap-10 px-6 pt-28 pb-6 text-center">
        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
          className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          A little something, just for you
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.12 }}
          className="max-w-md font-serif text-4xl leading-tight md:text-5xl">
          Hey Angel, I made something special for you…
          <span className="mt-3 block font-normal italic">Do you want to see?</span>
        </motion.h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }} className="flex gap-4">
          <button onClick={onYes} className={`${btn} bg-blush text-foreground shadow-soft`}>YES</button>
          <motion.button
            animate={pos}
            transition={{ type: "spring", stiffness: 500, damping: 18 }}
            onPointerEnter={jump} onPointerDown={(e) => { e.preventDefault(); jump(); }} onTouchStart={jump} onClick={jump}
            className={`${btn} border-2 border-foreground bg-background`}
          >NO</motion.button>
        </motion.div>
      </div>
    </section>
  );
}

export function Envelope({ onOpen }: { onOpen: () => void }) {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    setSize({ w: window.innerWidth, h: window.innerHeight });
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);
  const tap = () => {
    if (open) return;
    setOpen(true);
    timer.current = setTimeout(onOpen, 3200);
  };
  return (
    <section className={`${screen} bg-envelope-scene text-night-foreground`}>
      <Snow />
      <div className="relative z-10 flex min-h-full flex-col items-center justify-center gap-8 px-5 pt-28 pb-6 text-center">
        {open && size.w > 0 && <Confetti width={size.w} height={size.h} numberOfPieces={190} recycle={false} className="!fixed inset-0 z-40 pointer-events-none" />}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-night-foreground/60">A note for you</p>
          <h2 className="font-serif text-3xl italic md:text-4xl">Something lovely is inside</h2>
        </motion.div>
        <motion.button
          type="button"
          onClick={tap}
          disabled={open}
          aria-label={open ? "Birthday card opened" : "Open the birthday envelope"}
          className={`envelope-button ${open ? "envelope-open" : ""}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
        >
          <span className="envelope" aria-hidden="true">
            <span className="envelope-back" />
            <span className="envelope-card">
              <span className="envelope-card-heart">♡</span>
              <span className="envelope-card-title">Happy Birthday</span>
              <span className="envelope-card-name">Angel</span>
            </span>
            <span className="envelope-front" />
            <span className="envelope-flap" />
          </span>
        </motion.button>
        <motion.p animate={{ opacity: open ? 0.65 : 1 }} className="text-base font-medium text-night-foreground/75">
          {open ? "Happy Birthday, Angel 💗" : "Tap the envelope to open it"}
        </motion.p>
      </div>
    </section>
  );
}

function Snowflake({ index }: { index: number }) {
  const size = 10 + (index % 5) * 3;
  return (
    <span className="snowflake" style={{
      left: `${(index * 37) % 100}%`, width: size, height: size,
      opacity: 0.28 + (index % 6) * 0.09,
      animationDuration: `${9 + (index % 8)}s`, animationDelay: `${-(index % 14)}s`,
    }}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 2v20M4 6l16 12M4 18L20 6M8 4l4 3 4-3M8 20l4-3 4 3M4 10l4 2-4 2M20 10l-4 2 4 2"
          stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Snow() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 30 }, (_, k) => <Snowflake key={k} index={k} />)}
    </div>
  );
}

function Stars({ count = 64 }: { count?: number }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }, (_, k) => {
        const size = 1 + (k % 2);
        return <span key={k} className="star" style={{
          left: `${(k * 41) % 100}%`, top: `${(k * 29) % 96}%`, width: size, height: size,
          animationDelay: `${-(k % 9) * 0.45}s`, animationDuration: `${3 + (k % 5)}s`,
        }} />;
      })}
    </div>
  );
}

const memories = [m1, m2, m3, m1, m2, m3];

function MemoryRing({ paused }: { paused: boolean }) {
  const rotate = useMotionValue(0);
  const speed = useRef(1);
  useAnimationFrame((_, delta) => {
    speed.current += ((paused ? 0 : 1) - speed.current) * Math.min(1, delta / 250);
    rotate.set((rotate.get() + (360 / 20000) * delta * speed.current) % 360);
  });
  const step = 360 / memories.length;
  return (
    <motion.div className="ring3d" style={{ rotateY: rotate }}>
      {memories.map((memory, k) => (
        <img key={k} className="ring3d-item" src={memory.url} alt={k < 3 ? `Favorite memory ${k + 1}` : ""} aria-hidden={k >= 3 || undefined}
          draggable={false} style={{ transform: `rotateY(${k * step}deg) translateZ(var(--ring-radius))` }} />
      ))}
    </motion.div>
  );
}

export function Memories({ onNext }: { onNext: () => void }) {
  const [paused, setPaused] = useState(false);
  return (
    <section className={`${screen} bg-memory text-night-foreground`}>
      <Stars count={38} />
      <Snow />
      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center gap-8 overflow-x-hidden pt-24 pb-6">
        <h2 className="px-6 text-center font-serif text-2xl font-normal tracking-wide text-night-foreground/75 md:text-3xl">
          Little moments, kept forever
        </h2>
        <div className="ring3d-stage" role="region" aria-label="Rotating favorite memories. Touch or hover to pause." tabIndex={0}
          onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}
          onPointerDown={() => setPaused(true)} onPointerUp={(e) => { if (e.pointerType !== "mouse") setPaused(false); }}
          onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
          <MemoryRing paused={paused} />
        </div>
        <p className="text-sm text-night-foreground/55">{paused ? "Paused for a closer look" : "Touch to pause"}</p>
        <button onClick={onNext} className={`${btn} bg-blush text-foreground shadow-soft`}>Next →</button>
      </div>
    </section>
  );
}

function Flower({ x, h, d, petal }: { x: number; h: number; d: number; petal: string }) {
  return (
    <g transform={`translate(${x} 300)`}>
      <motion.path d={`M0 0 Q ${h / 6} ${-h / 2} 0 ${-h}`} stroke="var(--leaf)" strokeWidth="3" fill="none"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, delay: d }} />
      <motion.ellipse cx="8" cy={-h * 0.45} rx="8" ry="4" fill="var(--leaf)" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: d + 0.8 }} />
      <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: d + 1.3, type: "spring" }} style={{ originX: "0px", originY: `${-h}px` }}>
        {[0, 72, 144, 216, 288].map((r) => <ellipse key={r} cx="0" cy={-h - 9} rx="6" ry="10" fill={petal} transform={`rotate(${r} 0 ${-h})`} />)}
        <circle cx="0" cy={-h} r="5" fill="var(--flame-core)" />
      </motion.g>
    </g>
  );
}

function Frosting() {
  return (
    <div className="absolute inset-x-0 top-0 h-5 rounded-t-2xl bg-frosting">
      <div className="absolute -bottom-2 left-0 flex w-full justify-around">
        {[0, 1, 2, 3, 4].map((k) => <span key={k} className="h-4 w-4 rounded-full bg-frosting" />)}
      </div>
    </div>
  );
}

function PastelAtmosphere({ flashing }: { flashing: boolean }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="pastel-light" />
      <span className="pastel-light" />
      {flashing && <motion.div className="stage-flash absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.65, 0.12, 0.45, 0] }} transition={{ duration: 1.2 }} />}
    </div>
  );
}

export function CakeScreen({ onLetter }: { onLetter: () => void }) {
  const [showCake, setShowCake] = useState(false);
  const [out, setOut] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShowCake(true), 2200); return () => clearTimeout(t); }, []);
  const flowers = [[20, 120, 0, "var(--petal)"], [70, 170, 0.3, "var(--lavender)"], [120, 100, 0.6, "var(--petal)"], [240, 110, 0.4, "var(--petal)"], [290, 180, 0.1, "var(--lavender)"], [340, 130, 0.5, "var(--petal)"]] as const;
  return (
    <section className={`${screen} bg-cake text-night-foreground`}>
      <Stars count={34} />
      <PastelAtmosphere flashing={out} />
      <svg viewBox="0 0 360 300" className="pointer-events-none absolute bottom-0 left-0 w-full opacity-45">
        {flowers.map(([x, h, d, p], k) => <Flower key={k} x={x} h={h} d={d} petal={p} />)}
      </svg>
      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center gap-6 px-5 pt-28 pb-6">
        <AnimatePresence>
          {showCake && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex flex-col items-center gap-7 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-night-foreground/55">One wish, just for you</p>
              <button onClick={() => setOut(true)} disabled={out} aria-label="Blow out the candles" className="cake-elegant relative mt-16 flex cursor-pointer flex-col items-center disabled:cursor-default">
                <div className="absolute -top-16 flex gap-7">
                  {[0, 1, 2].map((k) => (
                    <div key={k} className="relative flex flex-col items-center">
                      <div className="relative h-6 w-4">
                        {!out ? <div className="flame absolute inset-0" style={{ animationDelay: `${k * 0.1}s` }} /> : <div className="smoke absolute bottom-0 left-1/2 h-4 w-4" />}
                      </div>
                      <div className="h-9 w-2.5 rounded-sm bg-blush" />
                    </div>
                  ))}
                </div>
                <div className="relative h-16 w-32 rounded-b-lg rounded-t-2xl bg-sponge"><Frosting /></div>
                <div className="relative h-20 w-48 rounded-b-lg rounded-t-2xl bg-sponge"><Frosting /></div>
                <div className="relative h-24 w-64 rounded-b-xl rounded-t-2xl bg-sponge">
                  <Frosting />
                  <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center">
                    <div className="flex gap-8"><span className="h-2.5 w-2.5 rounded-full bg-foreground" /><span className="h-2.5 w-2.5 rounded-full bg-foreground" /></div>
                    <div className="mt-1 flex gap-14"><span className="h-2 w-3 rounded-full bg-blush-deep/60" /><span className="h-2 w-3 rounded-full bg-blush-deep/60" /></div>
                    <span className="-mt-1 h-3 w-5 rounded-b-full border-2 border-t-0 border-foreground" />
                  </div>
                </div>
                <div className="h-3 w-72 max-w-[80vw] rounded-full bg-night-foreground/55" />
              </button>
              <p className="max-w-xs text-lg font-medium text-night-foreground/85">{out ? "Happy Birthday, Angel! 🎂" : "Make a wish and tap to blow out the candles!"}</p>
              <AnimatePresence>{out && (
                <motion.button initial={{ opacity: 0, y: -90, scale: 0.7 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.75, type: "spring", stiffness: 280, damping: 12 }}
                  onClick={onLetter} className={`${btn} bg-blush text-foreground shadow-soft`}>Secret Message 💌</motion.button>
              )}</AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

const bokehLights = Array.from({ length: 14 }, (_, k) => ({
  left: (k * 53) % 96, top: 20 + ((k * 37) % 80), size: 60 + ((k * 29) % 120),
  opacity: 0.1 + ((k * 7) % 4) * 0.1, duration: 14 + (k % 6) * 3, delay: -k * 1.7,
  tone: k % 2 ? "bokeh-pearl" : "bokeh-champagne",
}));

function Bokeh() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {bokehLights.map((orb, k) => (
        <motion.span key={k} className={`bokeh-orb ${orb.tone}`}
          style={{ left: `${orb.left}%`, top: `${orb.top}%`, width: orb.size, height: orb.size }}
          animate={{ y: [0, -260], opacity: [0, orb.opacity, orb.opacity, 0], scale: [1, 1.15, 0.95, 1.1] }}
          transition={{ duration: orb.duration, delay: orb.delay, repeat: Infinity, ease: "linear" }} />
      ))}
    </div>
  );
}

const letterList = { hidden: {}, show: { transition: { staggerChildren: 0.45, delayChildren: 0.5 } } };
const letterItem = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" as const } } };

export function Letter() {
  return (
    <section className={`${screen} bg-letter text-foreground`}>
      <Bokeh />
      <div className="relative z-10 min-h-full px-6 pt-28 pb-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="mx-auto max-w-md">
          <motion.article animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            variants={letterList} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="letter-card rounded-3xl p-8 backdrop-blur-xl" style={{ willChange: "transform" }}>
            <motion.p variants={letterItem} className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-foreground/55">A birthday letter</motion.p>
            <motion.h1 variants={letterItem} className="mb-6 font-serif text-4xl italic">Dearest Angel,</motion.h1>
            <div className="space-y-5 text-[17px] leading-loose text-foreground/90">
              <motion.p variants={letterItem}>Happy 17th! I still find it amazing how you can be so effortlessly playful and goofy one minute, and then completely surprise me with how deeply you think about things the next.</motion.p>
              <motion.p variants={letterItem}>You've got this crazy mix of being super childish, but genuinely mature and intellectual when it actually counts.</motion.p>
              <motion.p variants={letterItem}>I really admire your confidence. You're brave, and you never back down from being exactly who you are. Don't ever lose that.</motion.p>
              <motion.p variants={letterItem}>I hope 17 is your best year yet. Keep that fun-loving energy alive, and keep taking on the world.</motion.p>
            </div>
            <motion.p variants={letterItem} className="mt-10 text-right font-serif text-xl italic">Yours, Utkarsh</motion.p>
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
}

export function CassettePlayer() {
  const audio = useRef<HTMLAudioElement>(null);
  const [on, setOn] = useState(false);
  const toggle = () => {
    const element = audio.current;
    if (!element) return;
    if (element.paused) element.play().catch(() => setOn(false));
    else element.pause();
  };
  return (
    <>
      <audio ref={audio} src={song.url} loop preload="none"
        onPlay={() => setOn(true)} onPause={() => setOn(false)} onEnded={() => setOn(false)} />
      <div className="fixed bottom-6 right-6 z-[100] origin-bottom-right scale-[0.65] transform sm:scale-75 md:scale-90">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.2 }}>
          <Button variant="mixtape" size="mixtape" onClick={toggle}
            aria-label={on ? "Pause Tum Hi Ho" : "Play Tum Hi Ho"} aria-pressed={on}
            title={on ? "Pause Tum Hi Ho" : "Tap for Tum Hi Ho 🎵"}
            className={`cassette-player ${on ? "is-playing" : ""}`}>
            <span className="flex w-full items-center justify-between text-[9px] font-semibold tracking-wide" aria-hidden="true">
              <span>VOL. 1</span><span>TUM HI HO</span>
            </span>
            <span className="cassette-window" aria-hidden="true">
              <span className="tape-reel" />
              <span className="tape-equalizer">
                {[0, 1, 2, 3].map((bar) => <span key={bar} />)}
              </span>
              <span className="tape-reel" />
            </span>
            <span className="flex items-center justify-center gap-1.5 text-[9px] font-semibold tracking-wide" aria-hidden="true">
              {on ? <Pause className="!size-3" /> : <Play className="!size-3" />}
              {on ? "PAUSE" : "PLAY"}
            </span>
          </Button>
        </motion.div>
      </div>
    </>
  );
}
