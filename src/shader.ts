import { ModuleRegistry, linkWgsl } from "wgsl-linker";
import src from "./main.wgsl?raw";
import utilWgsl from "./util.wgsl?raw";
import { Drawable } from "./app.ts";

export async function createShader(
  device: GPUDevice,
  canvasContext: GPUCanvasContext
): Promise<Drawable> {
  const registry = new ModuleRegistry(utilWgsl);
  const code = linkWgsl(src, registry);
  console.log(code);
  const shaderModule = device.createShaderModule({ code });

  const bindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        buffer: { type: "uniform" },
      },
    ],
  });

  const uniformBufferSize = 1 * 4; // .frame
  const uniformBuffer = device.createBuffer({
    size: uniformBufferSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

  const pipeline = device.createRenderPipeline({
    layout: device.createPipelineLayout({
      bindGroupLayouts: [bindGroupLayout],
    }),
    vertex: {
      module: shaderModule,
      entryPoint: "vtx_main",
    },
    fragment: {
      module: shaderModule,
      entryPoint: "frag_main",
      targets: [{ format: presentationFormat }],
    },
    primitive: {
      topology: "triangle-strip",
    },
  });

  const uniformBindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      {
        binding: 0,
        resource: {
          buffer: uniformBuffer,
        },
      },
    ],
  });

  const uniformData = new ArrayBuffer(uniformBufferSize);

  let frameNumber = 0;

  function draw() {
    const view = new DataView(uniformData);
    view.setUint32(0, frameNumber++, true);

    device.queue.writeBuffer(uniformBuffer, 0, uniformData);

    const commandEncoder = device.createCommandEncoder();
    const textureView = canvasContext.getCurrentTexture().createView();

    const renderPassDescriptor = {
      colorAttachments: [
        {
          view: textureView,
          clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 0.0 },
          loadOp: "clear" as GPULoadOp,
          storeOp: "store" as GPUStoreOp,
        },
      ],
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, uniformBindGroup);
    passEncoder.draw(4, 1);
    passEncoder.end();

    device.queue.submit([commandEncoder.finish()]);
  }
  return { draw, stopped: true };
}
