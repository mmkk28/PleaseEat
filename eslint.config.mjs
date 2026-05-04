import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**'] },
  ...tseslint.configs.recommended,
  {
    rules: {
      // Codebase intentionally uses `any` in middleware/controller signatures
      '@typescript-eslint/no-explicit-any': 'off',
      // Codebase mixes require() with ES imports throughout
      '@typescript-eslint/no-require-imports': 'off',
      // Allow _-prefixed params that are intentionally unused (e.g. Express error handler next)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    }
  },
  {
    // Chai uses getter-style assertions (expect(x).to.be.true) which ESLint
    // sees as unused expressions. Disable that rule for test files only.
    files: ['tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
    }
  }
)
