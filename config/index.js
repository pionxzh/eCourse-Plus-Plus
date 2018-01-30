'use strict'
// Template version: 1.1.3
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
    build: {
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: false,
        // Gzip off because cloudFalre has gzip file for dev
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        bundleAnalyzerReport: true
    },
    dev: {
        env: require('./dev.env'),
        port: process.env.PORT || 8080,
        autoOpenBrowser: true,
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        proxyTable: {
            // 自訂 local 端的位置
            /* '/sso/': {
                target: 'https://portal.ccu.edu.tw/',  
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                  '^/sso/': ''
                }
            },*/
            '/ec/': {
                target: 'https://ecourse.ccu.edu.tw/',  
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                  '^/ec/': ''
                }
            }
        },
        cssSourceMap: false
    }
}
