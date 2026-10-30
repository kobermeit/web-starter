import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";

// Emits sw.js with every built file precached, so the app loads offline even right after the first visit.
function serviceWorker(): Plugin {
  return {
    name: "service-worker",
    apply: "build",
    async generateBundle(_options, bundle) {
      const hash = createHash("sha256");
      const files = ["/"];
      for (const file of Object.values(bundle)) {
        hash.update(file.type === "chunk" ? file.code : file.source);
        if (!file.fileName.endsWith(".html")) files.push(`/${file.fileName}`);
      }
      const template = await readFile("src/client/sw.js", "utf8");
      this.emitFile({
        type: "asset",
        fileName: "sw.js",
        source: template
          .replace("__VERSION__", hash.digest("hex").slice(0, 12))
          .replace("__PRECACHE__", JSON.stringify(files)),
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), serviceWorker()],
  build: { outDir: "dist/client", emptyOutDir: true },
  server: { proxy: { "/api": "http://localhost:3000" } },
});
