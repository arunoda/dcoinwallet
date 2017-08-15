module.exports = {
  webpack (cfg) {
    // Bitcoin lib is not working well when we are uglifying.
    // So, we need to stop doing that.
    cfg.plugins = cfg.plugins.filter((plugin) => {
      if (plugin.constructor.name === 'UglifyJsPlugin') {
        return false
      } else {
        return true
      }
    })
    return cfg
  },
}