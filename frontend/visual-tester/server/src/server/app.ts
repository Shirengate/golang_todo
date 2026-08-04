import morgan from "morgan";
import express, { type Express } from "express";
import { Config } from "../config/config.js";
import { ReportRouter } from "../routes/report.js";
import path from 'path'
import { fileURLToPath } from 'node:url';
import open from 'open'
class App {
  private static instance: App;

  private readonly _app: Express;
  private readonly _reportRouter: ReportRouter;
  private readonly clientDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)),"../../../client/dist");
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

    const serverUrl = `${config.serverProtocol}://${config.serverHost}:${config.serverPort}`;

    this._app.listen(config.serverPort, () => {
      console.log(`Visual test server running on ${serverUrl}`);
      open(serverUrl).then(() => {
        console.log(`UI available at ${serverUrl}`);
      });
    });
  }


  private _middlewares(): void {
    this._app.use(morgan("dev"));
    this._app.use(express.json());

    // Serve built client – resolved relative to server dist
    this._app.use(express.static(this.clientDist));
  }

  private _routes(): void {
    this._app.use(this._reportRouter.router);
    this._app.get("*splat", (req, res) => {
      res.sendFile(
        path.resolve(this.clientDist, 'index.html')
      )
    })
  }
}

export { App };
