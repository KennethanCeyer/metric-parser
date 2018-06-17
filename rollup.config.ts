import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';

const pkg = require('./package.json');
const libraryName = 'metric.parser';

export default {
    input: `src/${libraryName}.ts`,
    output: [
        { file: pkg.main, name: camelCase(libraryName), format: 'umd' },
        { file: pkg.module, format: 'es' },
    ],
    sourcemap: true,
    external: [],
    watch: {
        include: 'src/**',
    },
    plugins: [
        json(),
        typescript({
            useTsconfigDeclarationDir: true,
            tsconfigOverride: {
                compilerOptions: {
                    module: 'es2015'
                }
            }
        }),
        commonjs(),
        resolve(),
        sourceMaps(),
    ]
};
