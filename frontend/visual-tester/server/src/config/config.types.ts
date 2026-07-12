export interface StorybookRunOptions {
  /** Host to bind Storybook to */
  host: string;
  /** Port to run Storybook on */
  port: number;
}

export interface VisualTestConfig {
  /** Name of the folder where diff images are stored */
  diffFolderName: string;
  /** Name of the folder where reference screenshots are stored */
  referenceFolderName: string;
  /** Paths to folders that should be diffed */
  diffFolderPaths: string[];
  /** Options for launching Storybook */
  storybookRunOptions: StorybookRunOptions;
}
