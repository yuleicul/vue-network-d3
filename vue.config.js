module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vue-network-d3/'
    : '/',
  css: { extract: false }
}

