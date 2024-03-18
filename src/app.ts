import { LinkedSrc, simpleRenderShader, linkSrc } from "./shader.ts";
import { SlIconButton } from "@shoelace-style/shoelace";

export interface Drawable {
  draw(): void;
  stopped: boolean;
}

export async function createDrawing(
  canvas: HTMLCanvasElement,
  stopButton: HTMLButtonElement,
  srcPanel: HTMLDivElement
): Promise<void> {
  const gpu = navigator.gpu;
  if (!gpu) {
    return undefined;
  }
  const adapter = await gpu.requestAdapter();
  if (!adapter) return undefined;
  const device = await adapter.requestDevice();

  const canvasContext = configureCanvas(device, canvas, true);

  const linked = linkSrc();
  srcPanel.innerHTML = makeSrcPanel(linked);
  const drawable = await simpleRenderShader(device, canvasContext, linked.code);

  const buttonHandler = getButtonHandler(drawable);
  stopButton.addEventListener("click", buttonHandler);
  drawable.draw();

  drawLoop(drawable);
}

function makeSrcPanel(linked: LinkedSrc): string {
  const moduleEntries = Object.entries(linked.modules);
  const srcEntries = [["linked", linked.code], ...moduleEntries];
  const srcTabs = srcEntries
    .map(([name]) => `<sl-tab slot="nav" panel="${name}">${name}</sl-tab>`)
    .join("\n");
  const srcPanels = srcEntries
    .map(([name, src]) => `
      <sl-tab-panel name="${name}">
        <pre>
${src}
        </pre>
      </sl-tab-panel>`)
    .join("\n");

  const html = `
    <sl-tab-group placement="top">
      ${srcTabs}
      ${srcPanels}
    </sl-tab-group>`;

  return html;
}

type ButtonClickListener = (this: HTMLButtonElement, evt: MouseEvent) => void;

function getButtonHandler(drawable: Drawable): ButtonClickListener {
  return function buttonHandler(e: MouseEvent): void {
    const stopped = !drawable.stopped;
    drawable.stopped = stopped;
    const button = e.target as SlIconButton;
    button.name = stopped ? "play" : "pause";
    if (!stopped) drawLoop(drawable);
  };
}

function drawLoop(drawable: Drawable): void {
  drawRepeat();

  function drawRepeat(): void {
    if (drawable.stopped) return;
    drawable.draw();
    requestAnimationFrame(drawRepeat);
  }
}

/** configure the webgpu canvas context for typical webgpu use */
export function configureCanvas(
  device: GPUDevice,
  canvas: HTMLCanvasElement,
  debug = false
): GPUCanvasContext {
  const context = canvas.getContext("webgpu");
  if (!context) {
    throw new Error("no WebGPU context available");
  }
  let usage = GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_DST;
  if (debug) {
    usage |= GPUTextureUsage.COPY_SRC;
  }
  context.configure({
    device,
    alphaMode: "opaque",
    format: navigator.gpu.getPreferredCanvasFormat(),
    usage: usage,
  });

  return context;
}
