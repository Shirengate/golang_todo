import fg from "fast-glob";
import path from "path";
import { Config } from "../config/config.js";
import { Router, Request, Response } from "express";
import type { IRouter } from "./routes.types.js";

export class ReportRouter implements IRouter {
  public readonly router: Router;
  private projectRoot = process.cwd();
  private allowedList: Set<string> = new Set();

  constructor() {
    this.router = Router();
    this.routes();
  }

  async initialize() {
    const { config } = Config.getInstance();

    const files = await fg(
      [
        `**/${config.diffFolderName}/*.png`,
        `**/${config.referenceFolderName}/*.png`,
      ],
      {
        cwd: this.projectRoot,
        ignore: ["node_modules/**"],
      },
    );

    this.allowedList = new Set(files);
    console.log(
      `[ReportRouter] Скан завершен. Найдено файлов: ${this.allowedList.size}`,
    );
  }

  routes() {
    this.router.get("/api/report", async (req: Request, res: Response) => {
      const { config } = Config.getInstance();

      const reportMap: Record<string, any> = {};

      this.allowedList.forEach((filePath) => {
        const testId = filePath
          .replace(`${config.diffFolderName}/`, "")
          .replace(`${config.referenceFolderName}/`, "");

        if (!reportMap[testId]) {
          reportMap[testId] = { id: testId, name: path.basename(testId) };
        }

        if (filePath.includes(config.diffFolderName)) {
          reportMap[testId].diffUrl = `/static-assets/${filePath}`;
        } else {
          reportMap[testId].refUrl = `/static-assets/${filePath}`;
        }
      });

      res.json(Object.values(reportMap));
    });

    this.router.get("/static-assets/*", (req: Request, res: Response) => {
      const relativePath = req.params[0];

      if (!this.allowedList.has(relativePath)) {
        return res.status(403).send("Forbidden: File not in allowed list");
      }

      const absolutePath = path.resolve(this.projectRoot, relativePath);
      res.sendFile(absolutePath);
    });
  }
}
