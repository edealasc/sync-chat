import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.js",
      name: "ChatWidget",
      fileName: "chat-widget",
      formats: ["iife"], // output as plain JS usable in <script>
    },
  },
  server: {
    port: 3001, // dev server port
  },
});