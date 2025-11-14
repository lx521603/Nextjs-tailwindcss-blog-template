/** @type {import('next').NextConfig} */
const nextConfig = {
  // 其它 Next.js 配置
  reactStrictMode: true,

  // 构建时移除 console
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 构建阶段不因 ESLint 报错而失败
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 自定义 webpack 插件
  webpack: (config) => {
    config.plugins.push(new VeliteWebpackPlugin())
    return config
  },
}

module.exports = nextConfig

class VeliteWebpackPlugin {
  static started = false

  apply(/** @type {import('webpack').Compiler} */ compiler) {
    // Next.js 会执行三次：两次 server（nodejs / edge runtime），一次 client
    compiler.hooks.beforeCompile.tapPromise(
      'VeliteWebpackPlugin',
      async () => {
        if (VeliteWebpackPlugin.started) return
        VeliteWebpackPlugin.started = true

        const dev = compiler.options.mode === 'development'
        const { build } = await import('velite')

        await build({
          watch: dev,   // 开发模式下 watch
          clean: !dev,  // 生产模式下 clean
        })
      }
    )
  }
}
