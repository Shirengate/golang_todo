import type { VisualTestConfig } from './types.js';

export const DEFAULT_CONFIG: VisualTestConfig = {
  diffFolderName: '__diff_output__',
  referenceFolderName: '__image_snapshots__',
  diffFolderPaths: ['src'],
  storybookRunOptions: {
    host: 'localhost',
    port: 6006,
  },
  serverPort: 3000,
};
