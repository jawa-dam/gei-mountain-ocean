/* Bundles dam3d/src → ../dam-builder-3d-v2218.js (one IIFE, three.js tree-shaken, minified). Run: cd dam3d && npm i && npm run build */
import { build } from "esbuild";
import { statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { readFileSync } from "node:fs";
const out = new URL("../dam-builder-3d-v2218.js", import.meta.url).pathname;
await build({ entryPoints:[new URL("./src/main.js", import.meta.url).pathname], bundle:true, minify:true, format:"iife", target:"es2020", outfile:out, legalComments:"none", logLevel:"info" });
console.log("bundle", (statSync(out).size / 1024).toFixed(0) + " KB, gzip " + (gzipSync(readFileSync(out)).length / 1024).toFixed(0) + " KB");
