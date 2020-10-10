module.exports = {
  root: true,
  extends: ['@react-native-community', 'eslint:recommended'],
  plugins: ['react-hooks', 'react-native'],
  rules: {
    'no-unused-vars': 1,
    'no-var': 1,
    'no-console': 0,
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
    'react-native/no-inline-styles': 0,
    'react-hooks/rules-of-hooks': 2, // 检查 Hook 的规则
    'react-hooks/exhaustive-deps': 1, // 检查 effect 的依赖
    'no-shadow': 0,
    'react/self-closing-comp': 0,
    'no-inner-declarations': 0,
    'no-case-declarations': 1,
  },
};
