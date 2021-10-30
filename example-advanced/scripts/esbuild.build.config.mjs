/* eslint-disable no-undef */
import fs from 'fs'
import esbuild from 'esbuild'

if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist')
}

fs.copyFile('./src/index.html', './dist/index.html', (err) => {
  if (err) throw err
})

esbuild
  .build({
    entryPoints: ['src/index.tsx'],
    bundle: true,
    outfile: 'dist/bundle.js',
    minify: false,
    sourcemap: true,
    incremental: false,
    target: ['chrome58', 'firefox57', 'safari11', 'edge18'],
    define: {
      'process.env.NODE_ENV': '"production"',
    },
  })
  .catch(() => process.exit(1))
