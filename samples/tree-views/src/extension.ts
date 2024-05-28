// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { DepNodeProvider } from "./nodeDependencies";
import { TestView } from "./testView";
import { FileExplorer } from "./fileExplorer";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const rootPath =
    vscode.workspace.workspaceFolders &&
    vscode.workspace.workspaceFolders.length > 0
      ? vscode.workspace.workspaceFolders[0].uri.fsPath
      : undefined;

  const nodeDependenciesProvider = new DepNodeProvider(rootPath);

  vscode.window.registerTreeDataProvider(
    "nodeDependencies",
    nodeDependenciesProvider
  );
  vscode.commands.registerCommand("nodeDependencies.refreshEntry", () => {
    nodeDependenciesProvider.refresh();
  });
	vscode.commands.registerCommand('extension.openPackageOnNpm', moduleName => vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`https://www.npmjs.com/package/${moduleName}`)));

  new FileExplorer(context);

  new TestView(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
