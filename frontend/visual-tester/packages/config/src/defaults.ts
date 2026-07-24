import type { VisualTestConfig } from './types.js';

export const DEFAULT_CONFIG: VisualTestConfig = {
  diffFolderName: '__diff_output__',
  referenceFolderName: '__image_snapshots__',
  allowdFolderName:"__received_output__",
  storybookRunOptions: {
    host: 'localhost',
    port: 6006,
  },
  serverPort: 3000,
};
