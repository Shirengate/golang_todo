import { cosmiconfigSync } from "cosmiconfig";
import type { VisualTestConfig } from "./config.types.js";

const DEFAULT_CONFIG: VisualTestConfig = {
  diffFolderName: "__diff_output__",
  referenceFolderName: "__image_snapshots__",
  diffFolderPaths: ["src"],
  storybookRunOptions: {
    host: "localhost",
    port: 6006,
  },
  serverPort: 3000,
};

class Config {
  private static instance: Config;

  /** Resolved configuration, ready to use */
  public readonly config: VisualTestConfig;

  private constructor() {
    const explorer = cosmiconfigSync("visual-test");
    const result = explorer.search();
    const userConfig = (result?.config ?? {}) as Partial<VisualTestConfig>;

    this.config = {
      ...DEFAULT_CONFIG,
      ...userConfig,
      storybookRunOptions: {
        ...DEFAULT_CONFIG.storybookRunOptions,
        ...userConfig.storybookRunOptions,
      },
    };
  }

  /** Returns the singleton Config instance */
  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }
}

export { Config };
