import * as vscode from "vscode";

export const bracketSelection = vscode.commands.registerCommand(
  "amuris-toolbox.bracketSelection",
  () => {
    vscode.window.showInformationMessage("В разработке");
  }
);
