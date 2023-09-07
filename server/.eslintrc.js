module.exports = {
    env: {
        node: true,
    },
    extends: "eslint:recommended",
    parserOptions: {
        ecmaVersion: 6,
    },
    rules: {
        "no-console": "off",
        "no-var": "error",
        indent: ["error", 4],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
    },
};
