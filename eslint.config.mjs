import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

/** @type {import("eslint").Linter.Config[]} */
export default [
    {
        ignores: [
            ".next/**",
            "node_modules/**",
            "next-env.d.ts",
            "db/migrations/**",
            "public/**",
            "test-results/**",
            "playwright-report/**",
        ],
    },
    ...coreWebVitals,
    ...typescript,
];
