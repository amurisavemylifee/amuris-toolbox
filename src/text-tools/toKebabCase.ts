import * as vscode from "vscode";
import { getWordsFromSelections } from "./helpers";

function toKebabCaseHandler() {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    return;
  }

  const selections = editor.selections;
  const wordsArr = getWordsFromSelections(selections, editor);

  const convertedWords = wordsArr.map((words) => {
    return words
      .map((word) => {
        return word.toLowerCase();
      })
      .join("-");
  });

  return editor!.edit((builder) => {
    selections.forEach((selection, idx) => {
      builder.replace(selection, convertedWords[idx]);
    });
  });
}

export const toKebabCase = vscode.commands.registerCommand(
  "amuris-toolbox.toKebabCase",
  toKebabCaseHandler
);
