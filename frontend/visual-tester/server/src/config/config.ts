import { cosmiconfigSync } from "cosmiconfig";
import type { VisualTestConfig } from "./config.types.ts";

const DEFAULT_CONFIG: VisualTestConfig = {
  diffFolderName: "diff",
  referenceFolderName: "reference",
  diffFolderPaths: [],
  storybookRunOptions: {
    host: "localhost",
    port: 6006,
  },
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
    return Config.instance.config;
  }
}

const config = Config.getInstance().config;
export { config };
