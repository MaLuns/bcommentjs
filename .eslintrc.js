module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: ['plugin:vue/recommended'],
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'vue/no-v-html': 'off',
        'no-empty': 2,
        'no-alert': 2,
        'no-caller': 2,
        'no-constant-condition': 2,
        'no-control-regex': 2,
        'no-delete-var': 2,
        'no-dupe-keys': 2,
        'no-dupe-args': 2,
        'no-duplicate-case': 2,
        'no-empty-character-class': 2,
        'no-extra-boolean-cast': 2,
        'no-extra-semi': 2,
        'no-fallthrough': 2,
        'no-func-assign': 2,
        'no-inner-declarations': 2,
        'no-invalid-regexp': 2,
        'no-irregular-whitespace': 2,
        'no-mixed-requires': 2,
        'no-mixed-spaces-and-tabs': 2,
        'linebreak-style': [0, 'windows'],
        'no-multiple-empty-lines': 2,
        'no-negated-in-lhs': 2,
        'no-new-require': 2,
        'no-obj-calls': 2,
        'standard/no-callback-literal': 0,
        'no-octal': 2,
        'no-redeclare': 2,
        'no-regex-spaces': 2,
        'no-sparse-arrays': 1,
        'no-undef': 1,
        'no-tabs': 'off',
        'no-trailing-spaces': 'off',
        'spaced-comment': 1,
        'no-unreachable': 2,
        'no-unused-vars': 1,
        'quotes': ['error', 'single'],
        'vue/no-v-model-argument': 0,
        'vue/html-end-tags': 2,
        'vue/no-multiple-template-root': 0,
        'vue/require-explicit-emits': 2,
        'vue/v-on-event-hyphenation': 2,
        'vue/order-in-components': 2,
        'vue/component-name-in-template-casing': ['error', 'PascalCase', {
            'registeredComponentsOnly': true,
            'ignores': []
        }],
        'vue/html-indent': ['error', 4, {
            'attribute': 0,
            'baseIndent': 1,
            'closeBracket': 0,
            'alignAttributesVertically': false,
            'ignores': []
        }],
        'vue/max-attributes-per-line': ['error', {
            'singleline': {
                'max': 10
            },
            'multiline': {
                'max': 10
            }
        }],
        'vue/html-self-closing': ['error', {
            'html': {
                'void': 'never',
                'normal': 'any',
                'component': 'always'
            },
            'svg': 'always',
            'math': 'always'
        }]
    },
    parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: 7,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    overrides: [],
}
