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
  /** Name to folders with resived snapshot */
  allowdFolderName:string
  /** Options for launching Storybook */
  storybookRunOptions: StorybookRunOptions;
  /** Port for the visual test server itself */
  serverPort: number;
  /** Protocol for the visual test server (http or https) */
  serverProtocol: string;
  /** Host for the visual test server */
  serverHost: string;
}
