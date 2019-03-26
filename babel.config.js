
const presets = [
    [
      "@babel/preset-env",
      {
        targets: ["last 2 versions", "ie >= 10"],
        useBuiltIns: "usage",
      },
    ],
  ]
  
  const plugins = [
    "@babel/plugin-transform-shorthand-properties"
  ]
  
  module.exports = { presets, plugins, babelrc: false }