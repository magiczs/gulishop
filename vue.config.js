module.exports = {
  lintOnSave: false,
  devServer: {
    open: true,
    proxy: {
      "/api": {
        target: "http://182.92.128.115/",
      },
    },
  },
};
