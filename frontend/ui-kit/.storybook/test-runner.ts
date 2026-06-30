import type { TestRunnerConfig } from "@storybook/test-runner";
import path from "path";
import { toMatchImageSnapshot } from "jest-image-snapshot";
const config: TestRunnerConfig = {
  async postVisit(page, context) {
    expect.extend({ toMatchImageSnapshot });
    const screenshotName = `${context.id}.png`;
    const customScreenshotPath = path.join(
      process.cwd(),
      "src/test/screens",
      screenshotName,
    );
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot();
  },
};

export default config;
