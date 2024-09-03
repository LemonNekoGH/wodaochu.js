// for docker image
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
  ],
  format: ['esm'],
  minify: true,
  bundle: true,
  noExternal: ['mdast-util-to-markdown', 'mdast-util-math', 'mdast-util-gfm'],
  target: 'node20',
})
