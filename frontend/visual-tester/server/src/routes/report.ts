import fg from "fast-glob";
import path from "path";
import type { ReportListResponse } from "@gobs/visual-test-dto";
import { Config } from "../config/config.js";
import { Router, Request, Response } from "express";
import type { IRouter } from "./routes.types.js";
import { proccess_path } from "../utils/proccess_path.js";

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
        `**/${config.diffFolderName}/**/*.png`,
        `**/${config.referenceFolderName}/**/*.png`,
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

      const reportMap: Record<string, { name: string; diffUrl?: string; refUrl?: string }> = {};

      this.allowedList.forEach((filePath) => {
        const replacedPathName = filePath
          .replace(`${config.diffFolderName}/`, "")
          .replace(`${config.referenceFolderName}/`, "");

        const storyName = proccess_path(replacedPathName);

        if (!reportMap[storyName]) {
          reportMap[storyName] = { name: storyName };
        }

        if (filePath.includes(config.diffFolderName)) {
          reportMap[storyName].diffUrl = `/static-assets/${filePath}`;
        } else {
          reportMap[storyName].refUrl = `/static-assets/${filePath}`;
        }

      });

      const response: ReportListResponse = Object.values(reportMap)
        .filter((path) => path.diffUrl)
        .map((item, idx) => ({ ...item, id: idx }));

      res.json(response);
    });

    this.router.get("/static-assets/*splat", (req: Request, res: Response) => {
      const relativePath = req.params.splat;

      let resolvePath: string;

      if (typeof relativePath == "string") {
        resolvePath = relativePath;
      } else {
        resolvePath = relativePath.join("/");
      }

      console.log(relativePath);
      console.log(this.allowedList);
      if (!this.allowedList.has(resolvePath)) {
        return res.status(403).send("Forbidden: File not in allowed list");
      }

      const absolutePath = path.resolve(this.projectRoot, resolvePath);
      res.sendFile(absolutePath);
    });
  }
}
