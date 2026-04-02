import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import unocss from '@unocss/eslint-config/flat'
import importPlugin from 'eslint-plugin-import'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import sort from 'eslint-plugin-sort'
import globals from 'globals'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

// unplugin-auto-import 生成的全局变量（运行 dev/build 后自动更新）
let autoImportGlobals = {}
try {
  const autoImport = require('./.eslintrc-auto-import.json')
  // 将 true/false 转换为 flat config 需要的 "readonly"/"writable" 格式
  autoImportGlobals = Object.fromEntries(
    Object.entries(autoImport.globals || {}).map(([k, v]) => [k, v ? 'readonly' : 'writable'])
  )
} catch {
  // 首次运行前文件不存在，忽略
}

export default [
  // 忽略文件
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'build/**',
      'src/types/**',
      'packages/*/node_modules/**',
      '**/*.d.ts'
    ]
  },

  // JS 基础规则
  js.configs.recommended,

  // UnoCSS
  unocss,

  // sort 插件
  sort.configs['flat/recommended'],

  // 主配置
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...autoImportGlobals
      },
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      sort
    },
    rules: {
      // TypeScript
      ...tsPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      // React
      ...reactPlugin.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-no-undef': 'off', // 由 unplugin-auto-import 处理，globals 已声明
      'react-refresh/only-export-components': ['warn', { allowExportNames: ['loader', 'action', 'handle', 'shouldRevalidate'] }],

      // Import 排序
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc' },
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          pathGroups: [{ group: 'internal', pattern: '{@,~}/**' }],
          pathGroupsExcludedImportTypes: ['builtin']
        }
      ],
      'import/newline-after-import': 'error',

      // Sort 插件
      'sort/imports': 'off',
      'sort/import-members': ['error', { caseSensitive: true, natural: true }],
      'sort/string-enums': ['error', { caseSensitive: false, natural: true }],
      'sort/string-unions': ['error', { caseSensitive: false, natural: true }],
      'sort/type-properties': ['error', { caseSensitive: false, natural: true }],
      'sort/object-properties': 'off',

      // 格式
      semi: ['error', 'never'],
      'no-console': 'warn',
      'no-undef': 'off', // TypeScript 已处理类型检查，eslint 不需要重复
      'no-unused-vars': 'off' // 由 @typescript-eslint/no-unused-vars 接管
    },
    settings: {
      react: { version: 'detect' }
    }
  }
]
