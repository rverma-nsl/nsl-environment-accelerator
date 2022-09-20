load("@npm//:defs.bzl", "npm_link_all_packages")
load("@aspect_bazel_lib//lib:copy_to_bin.bzl", "copy_to_bin")
load("@aspect_rules_ts//ts:defs.bzl", "ts_library")
load("@aspect_rules_js//js:defs.bzl", "js_library")
load("@aspect_rules_js//npm:defs.bzl", "npm_package")

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

ts_library(
    name = "lib",
    srcs = [
        ":node_modules",
        ":srcs",
    ],
    declaration = True,
    tsconfig = "tsconfig",
    deps = [
        "//:node_modules/@types/node",
    ],
)

js_library(
    name = "js_lib",
    srcs = [":srcs" ],
    visibility = ["//visibility:public"],
)

npm_package(
    name = "common-types",
    srcs = [":lib"],
    package = "@nsl-aws-accelerator+common-types",
    visibility = ["//visibility:public"],
)