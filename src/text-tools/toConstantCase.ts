import * as vscode from "vscode";
import { getWordsFromSelections } from "./helpers";

function toConstantCaseHandler() {
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
      .join("_");
  });

  return editor!.edit((builder) => {
    selections.forEach((selection, idx) => {
      builder.replace(selection, convertedWords[idx]);
    });
  });
}

export const toConstantCase = vscode.commands.registerCommand(
  "amuris-toolbox.toConstantCase",
  toConstantCaseHandler
);
