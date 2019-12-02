const { port, prod_build_url } = require("./config");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  // 打包基础路径
  publicPath: process.env.NODE_ENV === "production" ? prod_build_url : "/",

  // 打包文件夹
  outputDir: "dist",

  // 静态文件
  assetsDir: "static",

  // 生产环境 sourceMap
  productionSourceMap: false,

  transpileDependencies: ["iview", "vue2-org-tree"],

  // 配置高于chainWebpack中关于 css loader 的配置
  css: {
    // 是否构建样式地图，false 将提高构建速度
    sourceMap: false,

    // css预设器配置项
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    port
  },

  configureWebpack: () => {
    if (process.env.NODE_ENV !== "development") {
      return {
        plugins: [
          new CompressionPlugin({
            test: /\.(js|css)(\?.*)?$/i, // 需要压缩的文件正则
            threshold: 10 * 1024, // 文件大小大于这个值时启用压缩
            deleteOriginalAssets: true // 压缩后是否删除原文件
          })
        ]
      };
    }
  }
};
