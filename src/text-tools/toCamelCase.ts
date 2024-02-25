import * as vscode from "vscode";
import { getWordsFromSelections } from "./helpers";

function toCamelCaseHandler() {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    return;
  }

  const selections = editor.selections;
  const wordsArr = getWordsFromSelections(selections, editor);

  const convertedWords = wordsArr.map((words) => {
    return words.reduce((acc, word, idx) => {
      if (idx === 0) {
        return acc + word.toLowerCase();
      }
      return acc + word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }, "");
  });

  return editor!.edit((builder) => {
    selections.forEach((selection, idx) => {
      builder.replace(selection, convertedWords[idx]);
    });
  });
}

export const toCamelCase = vscode.commands.registerCommand(
  "amuris-toolbox.toCamelCase",
  toCamelCaseHandler
);
