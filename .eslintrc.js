module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "rules": {
    "indent": [1, 2],
    "linebreak-style": [2, "unix"],
    "quotes": [2, "single"],
    "semi": [2, "always"],
    "no-inner-declarations": [0],
    "no-console": [1],
    "no-warning-comments": [1],
    "comma-dangle": [0],
    "no-param-reassign": [1],
    "prefer-const": [1],
    "no-unused-vars": [1],
    "no-underscore-dangle": [1, { "allowAfterThis": true }]
  },
    "extends": "airbnb-base",
    "plugins": [
        "import"
    ]
};
