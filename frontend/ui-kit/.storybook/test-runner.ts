import type { TestRunnerConfig } from "@storybook/test-runner";
import { toMatchImageSnapshot } from "jest-image-snapshot";
const config: TestRunnerConfig = {
  async postVisit(page) {
    expect.extend({ toMatchImageSnapshot });
    const image = await page.screenshot();
    expect(image).toMatchImageSnapshot({
      onlyDiff: true,
      storeReceivedOnFailure:true
    });
  },

};

export default config;
