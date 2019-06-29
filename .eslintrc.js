module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es6': true,
        'mocha': true,
        'node': true
    },
    'extends': 'eslint:recommended',
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018
    },
    'rules': {
        'array-bracket-spacing': [
            'error',
            'always'
        ],
        'block-spacing': [
            'error',
            'always'
        ],
        'brace-style': [
            'error',
            '1tbs'
        ],
        'comma-dangle': [
            'error',
            'only-multiline'
        ],
        'comma-spacing': [
            'error'
        ],
        'comma-style': [
            'error'
        ],
        'computed-property-spacing': [
            'error',
            'never'
        ],
        'func-call-spacing': [
            'error',
            'never'
        ],
        'key-spacing': [
            'error'
        ],
        'keyword-spacing': [
            'error'
        ],
        'max-depth': [
            'error',
            {
                'max': 4
            }
        ],
        'max-len': [
            'warn',
            {
                'code': 120,
                'ignoreRegExpLiterals': true
            }
        ],
        'max-lines': [
            'warn'
        ],
        'max-params': [
            'error',
            4
        ],
        'max-statements-per-line': [
            'error',
            {
                'max': 1
            }
        ],
        'no-negated-condition': [
            'error'
        ],
        'no-nested-ternary': [
            'error'
        ],
        'no-trailing-spaces': [
            'error'
        ],
        'no-unneeded-ternary': [
            'error'
        ],
        'no-whitespace-before-property': [
            'error'
        ],
        'operator-linebreak': [
            'error',
            'before'
        ],
        'quote-props': [
            'error',
            'as-needed'
        ],
        'eol-last': [
            'error',
            'always'
        ],
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'callback-return': [
            'error'
        ],
        'complexity': [
            'warn',
            {
                'max': 5
            }
        ],
        'curly': [
            'error'
        ],
        'dot-location': [
            'error',
            'property'
        ],
        'dot-notation': [
            'error'
        ],
        'eqeqeq': [
            'error',
            'always'
        ],
        'no-fallthrough': [
            'error'
        ],
        'no-multi-spaces': [
            'error'
        ],
        'no-return-await': [
            'error'
        ],
        'no-shadow': [
            'error'
        ],
        'no-sequences': [
            'error'
        ],
        'no-unmodified-loop-condition': [
            'error'
        ],
        'no-use-before-define': [
            'error'
        ],
        'no-useless-return': [
            'error'
        ],
        'no-var': [
            'error'
        ],
        'no-warning-comments': [
            'warn'
        ],
        'prefer-promise-reject-errors': [
            'error'
        ],
        'require-await': [
            'error'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'semi-spacing': [
            'error'
        ],
        'space-before-blocks': [
            'error'
        ],
        'space-before-function-paren': [
            'error'
        ],
        'space-in-parens': [
            'error',
            'never'
        ],
        'spaced-comment': [
            'error'
        ],
        'arrow-spacing': [
            'error'
        ],
        'no-confusing-arrow': [
            'error'
        ],
        'object-shorthand': [
            'error'
        ],
        'prefer-const': [
            'error'
        ],
        'prefer-template': [
            'error'
        ],
        'template-curly-spacing': [
            'error'
        ]
    }
};
