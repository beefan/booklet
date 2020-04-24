module.rules = [
  {
    test: /\.pug$/,
    loader: "pug-plain-loader"
  },
  {
    test: /\.sass$/,
    use: [
      "vue-style-loader",
      "css-loader",
      {
        loader: "sass-loader",
        options: {
          indentedSyntax: true,
          // sass-loader version >= 8
          sassOptions: {
            indentedSyntax: true
          },
          prependData: `variables.scss`
        }
      }
    ]
  }
];
