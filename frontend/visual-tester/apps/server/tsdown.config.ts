import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],

  deps: {
    neverBundle:true,
    alwaysBundle: ['@gobs/visual-test-config']
  }

})
