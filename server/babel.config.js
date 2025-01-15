export default {
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: 'current', // Ensures compatibility with the current Node.js version
          },
        },
      ],
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
    ],
  };  