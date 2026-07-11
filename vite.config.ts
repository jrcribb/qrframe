import { solidStart } from "@solidjs/start/config";
import { nitroV2Plugin as nitro } from "@solidjs/vite-plugin-nitro-2";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    UnoCSS(),
    solidStart({ ssr: true }),
    nitro({
      preset: "static",
      prerender: {
        crawlLinks: true,
      },
    }),
  ],
});
