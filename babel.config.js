const prodPlugins = []
if (process.env.NODE_ENV === 'production') {
  prodPlugins.push('transform-remove-console')
}

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'import',
      {
        libraryName: 'element-plus',
        styleLibraryName: 'theme-chalk',
      },
    ],
    'transform-remove-console',
    '@babel/plugin-syntax-dynamic-import',
  ],
}
