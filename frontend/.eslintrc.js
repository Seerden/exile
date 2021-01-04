module.exports = {
    "extends": ["react-app"],
    "rules": {
    },
    "overrides": [
        {
            "files": ["**/*.js?(x)"],
            "rules": {
                "react-hooks/exhaustive-deps": "off",
                "no-unused-vars": "off"
            }
        }
    ]
}