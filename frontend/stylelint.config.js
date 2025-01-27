export default {
  extends: ['stylelint-config-standard', 'stylelint-config-recommended'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['apply', 'layer', 'responsive', 'screen', 'tailwind', 'variants', 'theme'],
      },
    ],
    'no-descending-specificity': null,
    'at-rule-no-deprecated': [true, { ignoreAtRules: ['apply'] }],
    'import-notation': 'string',
    'custom-property-empty-line-before': null,
  },
};
