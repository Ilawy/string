import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

const pointerGuide = document.getElementById("pointer-guide");
if (pointerGuide) {
  pointerGuide.style.transition = "transform 0.1s 1ms ease-out"; // Add smooth transition

  let lastX = 0, lastY = 0;
  let ticking = false;

  window.addEventListener("pointermove", (event) => {
    lastX = event.clientX;
    lastY = event.clientY;

    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        pointerGuide.style.transform = `translate(${lastX}px, ${lastY}px)`;
        ticking = false;
      });
    }
  });
}

const canvas = document.getElementById("global-canvas") as HTMLCanvasElement;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d")!;
ctx.globalAlpha = 0;
ctx.clearRect(0, 0, canvas.width, canvas.height);
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});