import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    dts({
      include: ["src"],
      insertTypesEntry: true,
    }),
  ],

  build: {
    lib: {
      entry: {
        components: resolve(__dirname, "src/exports/components.ts"),
        icons: resolve(__dirname, "src/exports/icons.ts"),
        styles: resolve(__dirname, "src/exports/styles.ts"),
        vars: resolve(__dirname, "src/exports/vars.ts"),
      },
      formats: ["es", "cjs"],
      fileName: (format, entryName) => {
        if (format === "es") return `${entryName}.js`;
        return `${entryName}.cjs`;
      },
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
