import { cosmiconfigSync } from 'cosmiconfig';
import { DEFAULT_CONFIG } from './defaults.js';
import type { VisualTestConfig } from './types.js';

/**
 * Loads and merges user configuration from cosmiconfig.
 * Searches from `cwd` upward for a "visual-test" config.
 */
export function loadConfig(cwd: string = process.cwd()): VisualTestConfig {
  const explorer = cosmiconfigSync('visual-test');
  const result = explorer.search(cwd);
  const userConfig = (result?.config ?? {}) as Partial<VisualTestConfig>;

  return {
    ...DEFAULT_CONFIG,
    ...userConfig,
    storybookRunOptions: {
      ...DEFAULT_CONFIG.storybookRunOptions,
      ...userConfig.storybookRunOptions,
    },
  };
}
