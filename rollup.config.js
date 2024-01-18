import terser from '@rollup/plugin-terser';
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel'
import json from "@rollup/plugin-json";

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/bundle.cjs',
      format: 'cjs'
    }
  ],
  plugins: [
    resolve({
      extensions: ['.js'],
    }),
    commonjs(),
    json(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
    }),
    // terser()
  ],
};