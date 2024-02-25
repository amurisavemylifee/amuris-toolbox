import * as vscode from "vscode";

function textSwapHandler() {
  const editor = vscode.window.activeTextEditor;

  function getSelectionAndTextArray(
    selectionsParam: readonly vscode.Selection[]
  ) {
    return selectionsParam.map((selection, i) => {
      const idx = i === 0 ? 1 : 0;
      return {
        selection: selectionsParam[idx],
        text: editor!.document.getText(selection),
      };
    });
  }

  if (editor!.selections.length < 2) {
    return vscode.window.showErrorMessage(
      `Слишком мало выделений для замены (нужно 2)`
    );
  }

  if (editor!.selections.length > 2) {
    return vscode.window.showErrorMessage(
      `Слишком много выделений для замены (нужно 2)`
    );
  }

  let selectionAndTextArray = getSelectionAndTextArray(editor!.selections);

  const isBothSelectionsIncludeText =
    selectionAndTextArray.filter((el) => el.text).length === 1;

  const isNoOneSelectionsIncludeText =
    selectionAndTextArray.filter((el) => el.text).length === 0;

  if (isBothSelectionsIncludeText) {
    return vscode.window.showErrorMessage("Нет выделений для замены");
  }

  if (isNoOneSelectionsIncludeText) {
    const firstLine = editor!.document.lineAt(
      selectionAndTextArray[0].selection.start.line
    );
    const secondLine = editor!.document.lineAt(
      selectionAndTextArray[1].selection.end.line
    );

    editor!.selections = [
      new vscode.Selection(firstLine.range.start, firstLine.range.end),
      new vscode.Selection(secondLine.range.start, secondLine.range.end),
    ];

    selectionAndTextArray = getSelectionAndTextArray(editor!.selections);
  }

  return editor!.edit((builder) => {
    selectionAndTextArray.forEach(({ selection, text }) => {
      builder.replace(selection, text);
    });
  });
}

export const textSwap = vscode.commands.registerCommand(
  "amuris-toolbox.textSwap",
  textSwapHandler
);
