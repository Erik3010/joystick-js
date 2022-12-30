import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.js"),
      name: "joystick-js",
      fileName: (format) => `joystick-js.${format}.js`,
    },
  },
});
