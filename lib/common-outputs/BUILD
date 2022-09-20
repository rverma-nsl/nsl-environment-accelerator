load("@npm//:defs.bzl", "npm_link_all_packages")
load("@aspect_bazel_lib//lib:copy_to_bin.bzl", "copy_to_bin")
load("@aspect_rules_ts//ts:defs.bzl", "ts_project")

package(default_visibility = ["//visibility:public"])

# This macro expands to a link_npm_package for each third-party package in package.json
npm_link_all_packages(name = "node_modules")

copy_to_bin(
    name = "tsconfig",
    srcs = ["tsconfig.json"],
)

filegroup(
    name = "srcs",
    srcs = glob([
        "src/**",
    ]) + [
        "package.json",
        "tsconfig.json",
    ],
)

ts_project(
    name = "common_outputs",
    srcs = [
        ":node_modules",
        ":srcs",    
    ],
    declaration = True,
    resolve_json_module = True,
    tsconfig = "tsconfig",
    deps = [
        "//:node_modules/@types/node",
        "//lib/common-types"
    ],
)
