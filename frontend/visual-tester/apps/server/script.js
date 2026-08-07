#!/usr/bin/env node

import { loadConfig } from "@gobs/visual-test-config";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";
import waitOn from "wait-on";
// ── Load config ──────────────────────────────────────────────
const config = loadConfig();


// ── StoryBook config ─────────────────────────────────────────
const { storybookRunOptions = {} } = config;
const { host = "127.0.0.1", port = 6006 } = storybookRunOptions;

// Storybook start
const storybook = spawn(
  "npx",
  ["storybook", "dev", "--host", host, "--port", String(port), "--no-open"],
  {
    stdio: ["inherit", "pipe", "pipe"],
    shell: true,
  },
);
storybook.stdout.pipe(process.stdout);
storybook.stderr.pipe(process.stderr);

try {
  await waitOn({
    resources: [`http-get://${host}:${port}`],
    log: true,
  });

  storybook.stdout.unpipe(process.stdout);
  storybook.stderr.unpipe(process.stderr);
} catch (err) {
  console.error("Storybook не ответил вовремя или произошла ошибка");
  storybook.kill();
  process.exit(1);
}

// run test-storybook
const testRunnerProcces = spawn(`npx`, ["test-storybook", '--url', `${config.serverProtocol}://${host}:${port}`], {
  stdio: "inherit",
  shell: true,
});

// run test-server
testRunnerProcces.on("exit", (code) => {
  if (code == 0) {
    storybook.kill("SIGTERM");
    process.exit(0);
  }

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const serverPath = path.resolve(__dirname, "dist/index.js");

  const server = spawn("node", [serverPath], {
    stdio: "inherit",
  });

  server.on("close", (code) => {
    console.log(`Server exited with code ${code}`);
    storybook.kill("SIGTERM");
    process.exit(code);
  });
});
