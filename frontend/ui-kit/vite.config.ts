import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";
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
      entry: [
        "src/exports/componets.ts",
        "src/exports/icons.ts",
        "src/exports/styles.ts",
        "src/exports/vars.ts",
      ],
      formats: ["es", "cjs"],
      fileName: (formt, entry) => ``,
    },
  },
});
