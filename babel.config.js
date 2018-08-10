/* eslint-disable */

module.exports = {
  // Common to all envs below.
  plugins: [
    // Makes sure babel does not include the same code snipped in each file,
    // but imports helpers from a single module.
    ['@babel/plugin-transform-runtime', {
      polyfill: false
    }],
    ['@babel/plugin-proposal-class-properties'],
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-optional-catch-binding',
    '@babel/plugin-proposal-throw-expressions'
  ],
  // Used as the default for running babel-node scripts
  env: {
    development: {
      sourceMaps: 'both',
      presets: [
        ['@babel/preset-env', {
          useBuiltIns: 'usage',
          targets: {
            node: 'current'
          }
        }]
      ]
    },
    // Jest runs with NODE_ENV=test and will use the following.
    // We target the current node version to minimize transcompilation.
    // This should speed up the test run and make it more debugable.
    test: {
      sourceMaps: 'both',
      presets: [
        ['@babel/preset-env', {
          targets: {
            node: 'current'
          }
        }]
      ]
    }
  }
};
