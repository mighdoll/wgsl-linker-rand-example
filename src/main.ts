import { createDrawing } from "./app.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
  <canvas id="canvas" width="600" height="600"></canvas>
  <button id="stop">start</button>
  </div>
`;

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const stopButton = document.querySelector<HTMLButtonElement>("#stop")!;

createDrawing(canvas, stopButton);
