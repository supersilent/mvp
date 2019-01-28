module.exports = {
  "presets": [
    "@babel/preset-react",
    [
      "@babel/preset-env",
      {
        "loose": true,
        "modules": false
      },
    ],
  ],
  "plugins": [
    "transform-es2015-modules-commonjs",
    "transform-export-extensions",
  ]
};