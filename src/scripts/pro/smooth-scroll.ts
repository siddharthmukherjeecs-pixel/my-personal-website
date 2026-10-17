import Lenis from "lenis";
import { reducedMotion } from "./lib";

// lenis smooth scrolling (lerp 0.1), exposed on window for programmatic scrolls.
// Skipped entirely when the visitor prefers reduced motion.
const isTouch =
  typeof window !== "undefined" &&
  (window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
    window.innerWidth <= 809 ||
    "ontouchstart" in window);

if (!reducedMotion() && !isTouch) {
  const lenis = new Lenis({ lerp: 0.1 });
  window.__lenis = lenis;
  const loop = (t: number) => {
    lenis.raf(t);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
