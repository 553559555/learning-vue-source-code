/**
 * 打包开发环境
 *
 * node scripts/dev.js --format cjs
 */

import { parseArgs } from 'node:util'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import * as esbuild from 'esbuild'
import { createRequire } from 'node:module'

/**
 * 解析命令行参数
 */
const {
  values: { format },
  positionals,
} = parseArgs({
  allowPositionals: true,
  options: {
    format: {
      type: 'string',
      short: 'f',
      default: 'cjs',
    },
  },
})

// 创建esm 的 filename 和 dirname
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const require = createRequire(import.meta.url)

const target = positionals.length ? positionals[0] : 'vue'

const entry = resolve(__dirname, `../packages/${target}/src/index.ts`)

const outfile = resolve(
  __dirname,
  `../packages/${target}/dist/${target}.${format}.js`,
)

const pkg = require(`../packages/${target}/package.json`)

esbuild
  .context({
    entryPoints: [entry], // 入口文件
    outfile, // 输出文件
    format, // 打包格式
    platform: format === 'cjs' ? 'node' : 'browser', // 打包平台
    sourcemap: true,
    bundle: true,
    globalName: pkg.buildOptions?.name, // 全局变量名称
  })
  .then(ctx => ctx.watch())
