module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true
    },
    extends: "eslint:recommended",
    installedESLint: true,
    parserOptions: {
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
            jsx: true
        },
        sourceType: "module"
    },
    plugins: ["react"],
    "globals:": {},
    rules: {
        indent: ["error", 4],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
        no-unused-vars: false;
    }
};
