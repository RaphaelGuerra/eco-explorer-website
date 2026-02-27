const commonRules = {
  'no-unused-vars': 'warn',
  'prefer-const': 'error',
  'no-var': 'error',
};

module.exports = [
  {
    ignores: ['node_modules/**'],
  },
  {
    files: ['assets/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        localStorage: 'readonly',
        URL: 'readonly',
        fetch: 'readonly',
        FormData: 'readonly',
        IntersectionObserver: 'readonly',
        CustomEvent: 'readonly',
        URLSearchParams: 'readonly',
        requestAnimationFrame: 'readonly',
        history: 'readonly',
        setTimeout: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      ...commonRules,
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['sw.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'script',
      globals: {
        self: 'readonly',
        caches: 'readonly',
        URL: 'readonly',
        fetch: 'readonly',
        Promise: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      ...commonRules,
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      ...commonRules,
      'no-console': 'off',
    },
  },
];
