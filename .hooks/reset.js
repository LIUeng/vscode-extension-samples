// reset package.json
const pkg = require("../package.json");
const fs = require("node:fs");
const path = require("node:path");
const { parse, stringify } = require("comment-json");

pkg.main = "";
pkg.contributes = {};

fs.writeFileSync(
  path.resolve(__dirname, "../package.json"),
  JSON.stringify(pkg, null, 2),
  { encoding: "utf-8" }
);

// vscode json file
function clearVscodeJson(type, key) {
  const targetPath = path.resolve(__dirname, "../.vscode/" + type + ".json");
  const json = parse(fs.readFileSync(targetPath).toString());
  json[key] = [];
  fs.writeFileSync(targetPath, stringify(json, null, 2));
}

// launch.json
clearVscodeJson("launch", "configurations");
// tasks.json
clearVscodeJson("tasks", "tasks");
