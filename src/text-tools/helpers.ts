import * as vscode from "vscode";
import { BRACKETS_PAIRS, QUOTE_BRACKETS } from "./models";

function getTextFromSelections(
  selections: readonly vscode.Selection[],
  editor: vscode.TextEditor
) {
  return selections.map((selection) => {
    return editor.document.getText(selection);
  });
}

function getWordsFromText(strings: string[]) {
  let wordsArr = strings.map((text) => {
    return [text];
  });

  const spiltFn = (handler: (string: string) => string[]) => {
    return wordsArr.map((words) => {
      return words
        .map((item) => {
          return handler(item);
        })
        .flat(1);
    });
  };

  wordsArr = spiltFn((text) => text.split(" "));
  wordsArr = spiltFn((text) =>
    text.replace(/([A-Z])([a-z])/g, " $1$2")?.split(" ")
  );
  wordsArr = spiltFn((text) =>
    text.replace(/([a-z_-])([A-Z])/g, "$1 $2")?.split(" ")
  );
  wordsArr = spiltFn((text) => text.split("-"));
  wordsArr = spiltFn((text) => text.split("_"));
  wordsArr = wordsArr.map((words) => words.filter((word) => word.length));

  return wordsArr;
}

export function getWordsFromSelections(
  selections: readonly vscode.Selection[],
  editor: vscode.TextEditor
) {
  return getWordsFromText(getTextFromSelections(selections, editor));
}

export function isQuoteBracket(char: string): boolean {
  return QUOTE_BRACKETS.some((quote) => quote === char);
}

export function isOpenBracket(char: string): boolean {
  return BRACKETS_PAIRS.some((pair) => pair[0] === char);
}

export function isCloseBracket(char: string): boolean {
  return BRACKETS_PAIRS.some((pair) => pair[1] === char);
}

export function isAnyBracket(char: string): boolean {
  return isOpenBracket(char) || isCloseBracket(char) || isQuoteBracket(char);
}

export function isBracketCharsMatch(open: string, close: string): boolean {
  if (isQuoteBracket(open)) {
    return open === close;
  }

  return BRACKETS_PAIRS.some((pair) => pair[0] === open && pair[1] === close);
}
