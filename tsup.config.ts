import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/redis.ts",
  ],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
});