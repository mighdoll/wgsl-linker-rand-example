import { createShader } from "./shader.ts";

export interface Drawable {
  draw(): void;
  stopped: boolean;
}

export async function createDrawing(
  canvas: HTMLCanvasElement,
  stopButton: HTMLButtonElement
): Promise<void> {
  const gpu = navigator.gpu;
  if (!gpu) {
    return undefined;
  }
  const adapter = await gpu.requestAdapter();
  if (!adapter) return undefined;
  const device = await adapter.requestDevice();

  const canvasContext = configureCanvas(device, canvas, true);

  const drawable = await createShader(device, canvasContext);

  const buttonHandler = getButtonHandler(drawable);
  stopButton.addEventListener("click", buttonHandler);
  drawable.draw();

  drawLoop(drawable);
}

type ButtonClickListener = (this: HTMLButtonElement, evt: MouseEvent) => void;

function getButtonHandler(drawable: Drawable): ButtonClickListener {
  return function buttonHandler(e: MouseEvent): void {
    const stopped = !drawable.stopped;
    drawable.stopped = stopped;
    const button = e.target as HTMLButtonElement;
    const text = stopped ? "start" : "stop";
    button.innerHTML = text;
    if (!stopped) drawLoop(drawable);
  };
}

function drawLoop(drawable: Drawable): void {
  drawRepeat();

  function drawRepeat() {
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
