load("@aspect_rules_ts//ts:defs.bzl", "ts_config")
load("@npm//:defs.bzl", "npm_link_all_packages")

# Link npm packages
npm_link_all_packages(name = "node_modules")

# The root repo tsconfig
ts_config(
    name = "tsconfig",
    src = "tsconfig.json",
    visibility = ["//visibility:public"],
    deps = ["tsconfig.base.json"],
)

ts_config(
    name = "tsconfig.eslint",
    src = "tsconfig.eslint.json",
    visibility = ["//visibility:public"],
    deps = ["tsconfig.base.json"],
)