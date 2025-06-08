import { createConfig } from "@lilianaa/configs/eslint.config.mjs";

export default createConfig({
  ignores: ["node_modules", "dist"],
  vue: true,
});
