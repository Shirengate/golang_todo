import { loadConfig, type VisualTestConfig } from "@gobs/visual-test-config";

class Config {
  private static instance: Config;

  /** Resolved configuration, ready to use */
  public readonly config: VisualTestConfig;

  private constructor() {
    this.config = loadConfig();
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
