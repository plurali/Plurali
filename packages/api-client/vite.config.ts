import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [dts({ root: ".", outDir: "./dist" })],
  build: {
    sourcemap: true,
    lib: {
      formats: ["cjs", "es"],
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "PluraliApiClient",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      input: "./src/index.ts",
    },
  },
});
