import { createDrawing } from "./app.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
  <canvas id="canvas" width="300" height="300" style="width:600px; height:600px; image-rendering:pixelated"></canvas>
  <button id="stop">start</button>
  </div>
`;

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const stopButton = document.querySelector<HTMLButtonElement>("#stop")!;

createDrawing(canvas, stopButton);
