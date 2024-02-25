import * as vscode from "vscode";

import * as textTools from "./text-tools";
import * as filesTools from "./files-tools";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    ...Object.values(textTools),
    ...Object.values(filesTools)
  );
}

export function deactivate() {}
