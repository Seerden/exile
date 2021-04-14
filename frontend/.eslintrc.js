module.exports = {
    "extends": ["react-app"],
    "rules": {
    },
    "overrides": [
        {
            "files": ["**/*.js?(x)", "**/*.ts?(x)"],
            "rules": {
                "react-hooks/exhaustive-deps": "off",
                "no-unused-vars": "off",
                "@typescript-eslint/no-unused-vars": "off"
            }
        }
    ]
}