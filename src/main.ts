import "@shoelace-style/shoelace";
import "@shoelace-style/shoelace/dist/themes/light.css";
import { createDrawing } from "./app.ts";

import { setBasePath } from "@shoelace-style/shoelace";
setBasePath("/shoelace-assets");

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
  <canvas id="canvas" width="150" height="150" style="width:300px; height:300px; image-rendering:pixelated"></canvas>
  <sl-icon-button id="stop" name="play" style="font-size: 2rem"></sl-icon-button>
  <sl-tab-group placement="top">
    <sl-tab slot="nav" panel="linked">linked</sl-tab>
    <sl-tab slot="nav" panel="main">main</sl-tab>
    <sl-tab slot="nav" panel="util">util</sl-tab>

    <sl-tab-panel name="linked">This is the linked tab panel.</sl-tab-panel>
    <sl-tab-panel name="main">This is the main tab panel.</sl-tab-panel>
    <sl-tab-panel name="util">This is the util tab panel.</sl-tab-panel>
  </sl-tab-group>
  </div>
`;

const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
const stopButton = document.querySelector<HTMLButtonElement>("#stop")!;

createDrawing(canvas, stopButton);
