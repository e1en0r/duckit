export default [
  {
    files: ['**/*.tsx'],
    rules: {
      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: ['Link'],
          specialLink: ['onClick', 'to'],
        },
      ],
    },
  },
];
