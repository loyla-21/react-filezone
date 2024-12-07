import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import { readFileSync } from 'fs';
import path from 'path';

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

export default [
  {
    input: "./src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      json(), // Add JSON plugin
      commonjs(),
      typescript({ 
        tsconfig: "./tsconfig.json",
        declarationDir: path.dirname(packageJson.main),
        module: "esnext",
        jsx: "react-jsx"
      }),
      terser(),
    ],
    external: ['react', 'uuid', 'axios'],
  },
  {
    input: "./src/index.ts",
    output: [
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      json(), // Add JSON plugin
      commonjs(),
      typescript({ 
        tsconfig: "./tsconfig.json",
        declarationDir: path.dirname(packageJson.module),
        module: "esnext",
        jsx: "react-jsx"
      }),
      terser(),
    ],
    external: ['react', 'uuid', 'axios'],
  },
  {
    input: "./src/index.ts",
    output: [
      {
        file: packageJson.types,
        format: "esm",
      },
    ],
    plugins: [dts.default()],
  },
];

