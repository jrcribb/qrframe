import { defineConfig } from "@solidjs/start/config";
import UnoCSS from "unocss/vite";
import wasmpack from "vite-plugin-wasm-pack";

export default defineConfig({
  server: {
    preset: "cloudflare-pages-static",
    rollupConfig: {
      external: ["node:async_hooks"],
    },
  },
  ssr: true,
  vite: {
    plugins: [UnoCSS(), wasmpack([], ["fuqr"])],
  },
});
