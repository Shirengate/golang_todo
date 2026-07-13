import express, { type Express } from "express";
import { Config } from "../config/config.js";
import { ReportRouter } from "../routes/report.js";

class App {
  private static instance: App;

  private readonly _app: Express;
  private readonly _reportRouter: ReportRouter;

  private constructor() {
    this._app = express();
    this._reportRouter = new ReportRouter();

    this._middlewares();
    this._routes();
  }

  /** Returns the singleton App instance */
  public static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }

  /** The underlying Express application */
  public get app(): Express {
    return this._app;
  }

  /** Initializes async resources, then starts the HTTP server */
  public async start(): Promise<void> {
    await this._reportRouter.initialize();

    const { config } = Config.getInstance();

    this._app.listen(config.serverPort, () => {
      console.log(
        `Visual test server running on http://localhost:${config.serverPort}`,
      );
    });
  }

  private _middlewares(): void {
    this._app.use(express.json());

    // Serve built client – resolved relative to server dist
    const clientDist = new URL("../../client/dist", import.meta.url).pathname;
    this._app.use("*", express.static(clientDist));
  }

  private _routes(): void {
    this._app.use(this._reportRouter.router);
  }
}

export { App };
