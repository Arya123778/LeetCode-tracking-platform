// Suppress editor/TS warnings when vite types aren't available in the environment
// @ts-ignore: module not found in some IDE setups
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
    },
  },
});
