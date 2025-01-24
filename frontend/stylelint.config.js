export default {
  extends: ['stylelint-config-standard', 'stylelint-config-recommended'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['apply', 'layer', 'responsive', 'screen', 'tailwind', 'variants'],
      },
    ],
    'no-descending-specificity': null,
    'at-rule-no-deprecated': [true, { ignoreAtRules: ['apply'] }],
  },
};
