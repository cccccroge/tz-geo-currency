import terser from '@rollup/plugin-terser'

export default {
  input: 'src/index.js',
  plugins: [
    terser(),
  ],
  output: [
    {
      file: 'dist/bundle.cjs.js',
      format: 'cjs',
    },
    {
      file: 'dist/bundle.esm.js',
      format: 'es',
    },
  ],
}
