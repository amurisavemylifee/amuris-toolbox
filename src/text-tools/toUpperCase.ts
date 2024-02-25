import * as vscode from "vscode";
import { getWordsFromSelections } from "./helpers";

function toUpperCaseHandler() {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    return;
  }

  const selections = editor.selections;
  const wordsArr = getWordsFromSelections(selections, editor);

  const convertedWords = wordsArr.map((words) => {
    return words
      .map((word) => {
        return word.toUpperCase();
      })
      .join(" ");
  });

  return editor!.edit((builder) => {
    selections.forEach((selection, idx) => {
      builder.replace(selection, convertedWords[idx]);
    });
  });
}

export const toUpperCase = vscode.commands.registerCommand(
  "amuris-toolbox.toUpperCase",
  toUpperCaseHandler
);
