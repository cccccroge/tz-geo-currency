import terser from '@rollup/plugin-terser'

export default {
  input: 'src/index.js',
  plugins: [
    terser(),
  ],
  output: [
    {
      file: 'dist/tl.cjs.js',
      format: 'cjs',
    },
    {
      file: 'dist/tl.esm.js',
      format: 'es',
    },
  ],
}
