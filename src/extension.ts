import * as vscode from "vscode";
import { createIndex } from "./create-index";
import { textSwap } from "./text-swap";
import { bracketSelection } from "./bracket-selection";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(createIndex);
  context.subscriptions.push(textSwap);
  context.subscriptions.push(bracketSelection);
}

export function deactivate() {}
