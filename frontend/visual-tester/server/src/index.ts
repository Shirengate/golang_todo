import { App } from "./server/app.js";

const app = App.getInstance();
await app.start();
