#!/usr/bin/env node

import { spawn, execSync, spawnSync } from "node:child_process";
import { cosmiconfigSync } from "cosmiconfig";

// ── Load config ──────────────────────────────────────────────
const explorer = cosmiconfigSync("visual-test");
const result = explorer.search();
const config = result?.config ?? {};
const { storybookRunOptions = {}, serverPort = 3000 } = config;
const { host = "localhost", port = 6006 } = storybookRunOptions;

const storybookUrl = `http://${host}:${port}`;

// ── Main ─────────────────────────────────────────────────────
function log(msg) {
  console.log(`[visual-test] ${msg}`);
}

log(`Starting Storybook on ${storybookUrl}…`);
const storybook = spawn(
  "npx",
  ["storybook", "dev", "-p", String(port), "-h", host, "--no-open"],
  { stdio: ["inherit", "pipe", "inherit"] },
);

// Wait for Storybook to be ready by listening to its stdout
await new Promise((resolve) => {
  storybook.stdout?.on("data", (data) => {
    if (data.toString().includes("Storybook")) {
      resolve();
    }
  });
  // Fallback: resolve after timeout even if no matching output
  setTimeout(resolve, 10_000);
});

log("Running test-storybook…");
// const resul = execSync("pnpm run test-storybook", { stdio: "inherit" });
const res = spawnSync("npx", "test-storybook");
log("Stopping Storybook…");
storybook.kill("SIGTERM");

log(`Starting server on http://localhost:${serverPort}…`);
const server = spawn("node", ["server/dist/index.js"], { stdio: "inherit" });

server.on("close", (code) => {
  log(`Server exited with code ${code}`);
});
