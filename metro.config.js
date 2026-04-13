const path = require("path");
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    "react-native-web/dist/exports/NativeEventEmitter": path.resolve(__dirname, "lib/native-event-emitter-shim.js"),
    "react/compiler-runtime": path.resolve(__dirname, "node_modules/react-compiler-runtime"),
};

module.exports = config;
