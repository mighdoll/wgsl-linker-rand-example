import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "./node_modules/@shoelace-style/shoelace/dist/assets",
          dest: "shoelace-assets",
        },
      ],
    }),
  ],
});
