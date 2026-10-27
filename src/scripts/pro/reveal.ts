import { onScrollFrame, reducedMotion } from "./lib";

const EASE = (p: number) => 1 - Math.pow(1 - p, 3);
const SMOOTH = (p: number) => p * p * p * (p * (p * 6 - 15) + 10);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

const words = Array.from(document.querySelectorAll<HTMLElement>(".sw"));
const blocks = Array.from(document.querySelectorAll<HTMLElement>(".sf"));
const isMobile = window.innerWidth <= 809 || "ontouchstart" in window;
const WORD_BLUR = 14; // was 26
const BLOCK_BLUR = 10; // was 14

if (!reducedMotion() && (words.length || blocks.length)) {
  const wLast = new Float64Array(words.length).fill(-1);
  const bLast = new Float64Array(blocks.length).fill(-1);
  const wTop = new Float64Array(words.length);
  const bTop = new Float64Array(blocks.length);

  onScrollFrame(() => {
    const vh = window.innerHeight || 1;
    const ws = vh * 0.95;
    const we = vh * 0.52;
    const bs = vh * 1.02;
    const be = vh * 0.42;

    // 1) read every position first (one layout pass)
    for (let i = 0; i < words.length; i++) wTop[i] = words[i].getBoundingClientRect().top;
    for (let i = 0; i < blocks.length; i++) bTop[i] = blocks[i].getBoundingClientRect().top;

    // 2) then write, skipping elements whose value did not change
    for (let i = 0; i < words.length; i++) {
      const e = EASE(clamp01((ws - wTop[i]) / (ws - we)));
      if (e === wLast[i]) continue;
      wLast[i] = e;
      const s = words[i].style;
      const active = e > 0 && e < 0.999;
      s.opacity = String(e);
      s.filter = active && !isMobile ? `blur(${((1 - e) * WORD_BLUR).toFixed(2)}px)` : "none";
      s.willChange = active ? "opacity, filter" : "auto";
    }
    for (let i = 0; i < blocks.length; i++) {
      const e = SMOOTH(clamp01((bs - bTop[i]) / (bs - be)));
      if (e === bLast[i]) continue;
      bLast[i] = e;
      const s = blocks[i].style;
      const active = e > 0 && e < 0.999;
      s.opacity = e.toFixed(3);
      s.transform = e < 0.999 ? `translate3d(0, ${((1 - e) * 14).toFixed(2)}px, 0)` : "none";
      s.filter = active && !isMobile ? `blur(${((1 - e) * BLOCK_BLUR).toFixed(2)}px)` : "none";
      s.willChange = active ? "opacity, filter, transform" : "auto";
    }
  });
}