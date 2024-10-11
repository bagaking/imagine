   import { defineConfig } from "vite";
   import react from "@vitejs/plugin-react";
   import { resolve } from "path";

   export default defineConfig({
     plugins: [react()],
     build: {
       rollupOptions: {
         input: resolve(__dirname, "src/content.tsx"),
         output: {
            entryFileNames: "[name].js",
            chunkFileNames: "[name].js",
           assetFileNames: "assets/[name].[ext]",
           format: "iife",
         },
       },
       outDir: "dist/_content",
       sourcemap: true,
       minify: false,
     },
     resolve: {
       alias: {
         '@': resolve(__dirname, 'src'),
       },
     },
     css: {
       postcss: './postcss.config.js',
     },
   });