const promisify = require("./promisify");
const extendWithJsSources = require("./src");

const isElectronWebpack =
  // assume module required by webpack if no system path inv envs
  !process.env.path &&
  // detect if electron https://github.com/electron/electron/issues/2288
  global.window &&
  global.window.process &&
  global.window.process.type &&
  global.navigator &&
  (global.navigator.userAgent || "").toLowerCase().indexOf(" electron/") > -1;

let cv;

try {
  cv = isElectronWebpack
    ? require("../build/Release/opencv4nodejs.node")
    : require("./cv");

  // promisify async methods
  cv = promisify(cv);
  cv = extendWithJsSources(cv);
} catch (err) {
  console.log(`opencv4nodejs library isn't connected. platform should be x64 - current ${process.arch}, node12-21 - current ${process.version}, only mac,win,linux - current ${process.platform}`);
}

module.exports = cv;
