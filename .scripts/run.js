const yargsParser = require("yargs-parser");
const pkg = require("../package.json");
const fs = require("node:fs");
const path = require("node:path");
const { parse, stringify } = require("comment-json");

const { c: workspace } = yargsParser(process.argv.slice(2));
if (!workspace) {
  process.exit(0);
}
const targetPath = "../samples/" + workspace;
const workspaceCapName = workspace.replace(/^[a-z]/, (s) => s.toUpperCase());

// write .vscode json file
const vscodeJsonConfig = {
  launch: "configurations",
  tasks: "tasks",
};
function writeVscodeJson(vscodeType) {
  const vscodePath = path.resolve(
    __dirname,
    "../.vscode",
    vscodeType + ".json"
  );
  const json = parse(fs.readFileSync(vscodePath).toString());

  const debuggerPath = path.resolve(
    __dirname,
    targetPath + "/.vscode" + "/" + vscodeType + ".json"
  );
  const debuggerJson = parse(fs.readFileSync(debuggerPath).toString());

  const jsonKey = vscodeJsonConfig[vscodeType];
  json[jsonKey] = debuggerJson[jsonKey];

  fs.writeFileSync(vscodePath, stringify(json, null, 2));
}

// sync write contributes to root package.json
const targetSample = require(targetPath + "/package.json");
pkg.main = `./samples/${workspace}/dist/extension.js`;
pkg.contributes = targetSample.contributes;
fs.writeFileSync(
  path.resolve(__dirname, "../package.json"),
  JSON.stringify(pkg, null, 2),
  {
    encoding: "utf-8",
  }
);
console.log(`\n${workspaceCapName}'package.json write successfully!`);

// sync write launch.json
writeVscodeJson("launch");
console.log(`\n${workspaceCapName}'launch.json write successfully!`);

// sync write tasks.json
writeVscodeJson("tasks");
console.log(`\n${workspaceCapName}'tasks.json write successfully!`);
