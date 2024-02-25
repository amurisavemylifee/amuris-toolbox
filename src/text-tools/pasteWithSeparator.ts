import * as vscode from "vscode";
import { getWordsFromSelections } from "./helpers";

async function pasteWithSeparatorHandler() {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    return;
  }

  let text = await vscode.env.clipboard.readText();

  return editor.edit((builder) => {
    builder.replace(editor.selection, text.split("\n").join(",\n"));
  });
}

export const pasteWithSeparator = vscode.commands.registerCommand(
  "amuris-toolbox.pasteWithSeparator",
  pasteWithSeparatorHandler
);
