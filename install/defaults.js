const path = require("path");
const { basename } = require("path");
const { resolvePath } = require("../lib/commons");
const package = require("../package.json");

function getPathToDirLib() {
  if (process.platform === "darwin" && process.arch === "arm64") {
    return resolvePath(path.join(process.cwd(), "osOpencvWorlds", "darwinM1"));
  } else if (process.platform === "darwin" && process.arch !== "arm64") {
    return resolvePath(path.join(process.cwd(), "osOpencvWorlds", "darwin", "opencv", "build", "lib"));
  } else if (process.platform === "win32") {
    return resolvePath(path.join(process.cwd(), "osOpencvWorlds", "win32", "opencv", "build", "lib", "Release"));
  } else if (process.platform === "linux") {
    return resolvePath(path.join(process.cwd(), "osOpencvWorlds", "linux", "opencv", "build", "lib"));
  }
}

function getPathToLib(pathToDir) {
  if (process.platform === "darwin" && process.arch === "arm64") {
    return resolvePath(path.join(pathToDir, `libopencv_world.${package.opencv4nodejs.autoBuildOpencvVersion}.dylib`));
  } else if (process.platform === "darwin" && process.arch !== "arm64") {
    return resolvePath(pathToDir, `libopencv_world.${package.opencv4nodejs.autoBuildOpencvVersion}.dylib`);
  } else if (process.platform === "win32") {
    const version = package.opencv4nodejs.autoBuildOpencvVersion.replace(".", "").replace(".", "");

    return resolvePath(path.join(pathToDir, `opencv_world${version}.lib`));
  } else if (process.platform === "linux") {
    return resolvePath(path.join(pathToDir, `libopencv_world.so.${package.opencv4nodejs.autoBuildOpencvVersion}`));
  }
}

function getPathToInclude() {
  if (process.platform === "darwin" && process.arch === "arm64") {
    return [
      resolvePath(path.join(process.cwd(), "osOpencvWorlds", "darwinM1", "opencv", "build", "include")),
      resolvePath(path.join(process.cwd(), "osOpencvWorlds", "darwinM1", "opencv", "build", "include", "opencv4")),
    ];
  } else if (process.platform === "darwin" && process.arch !== "arm64") {
    return [
      resolvePath(path.join(process.cwd(), "osOpencvWorlds", "darwin", "opencv", "build", "include")),
      resolvePath(path.join(process.cwd(), "osOpencvWorlds", "darwin", "opencv", "build", "include", "opencv4")),
    ];
  } else if (process.platform === "win32") {
    return [
      resolvePath(path.join(process.cwd(), "osOpencvWorlds", "win32", "opencv", "build", "include")),
      resolvePath(path.join(process.cwd(), "osOpencvWorlds", "win32", "opencv", "build", "include", "opencv4")),
    ];
  } else if (process.platform === "linux") {
    return [
      resolvePath(path.join(process.cwd(), "osOpencvWorlds", "linux", "opencv", "build", "include")),
      resolvePath(path.join(process.cwd(), "osOpencvWorlds", "linux", "opencv", "build", "include", "opencv4")),
    ];
  }
}
const defines = ["OPENCV4NODEJS_FOUND_LIBRARY_WORLD"];

const pathToDirLib = getPathToDirLib();
const pathToLib = getPathToLib(pathToDirLib);
const pathToInclude = getPathToInclude();

const linkLib = (lib) => {
  if (process.platform === "darwin") {
    return `-l${basename(lib, ".dylib").replace("lib", "")}`;
  } else {
    return `-l:${basename(lib)}`;
  }
};
const libs = process.platform === "win32" ? [pathToLib] : ["-L" + pathToDirLib].concat(linkLib(pathToLib)).concat("-Wl,-rpath," + pathToDirLib);

process.env["OPENCV4NODEJS_DEFINES"] = defines.join("\n");
process.env["OPENCV4NODEJS_INCLUDES"] = pathToInclude.join("\n");
process.env["OPENCV4NODEJS_LIBRARIES"] = libs.join("\n");

module.exports = {
  OPENCV4NODEJS_LIBRARIES: pathToLib,
  OPENCV4NODEJS_INCLUDES: pathToInclude,
  OPENCV4NODEJS_DEFINES: defines,
};
