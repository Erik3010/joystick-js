import { defineConfig } from "vite";

export default defineConfig({
  base: {
    url: process.env.NODE_ENV === "production" ? "joystick-js" : "/",
  },
});
