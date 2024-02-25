import * as vscode from "vscode";

export function normalizeRangeOrPosition(
  param: vscode.Position | vscode.Range
) {
  return {
    toPositions: () => {
      if (param instanceof vscode.Position) {
        return param;
      } else if (param instanceof vscode.Range) {
        return [param.start, param.end];
      }
    },
    toRange: () => {
      if (param instanceof vscode.Position) {
        return new vscode.Range(param, param);
      } else if (param instanceof vscode.Range) {
        return param;
      }
    },
    start: param instanceof vscode.Position ? param : param.start,
    end: param instanceof vscode.Position ? param : param.end,
  };
}

export function toVscodeSelection({
  start,
  end,
}: {
  start: number;
  end: number;
}): vscode.Selection {
  const editor = vscode.window.activeTextEditor as vscode.TextEditor;

  return new vscode.Selection(
    editor.document.positionAt(start + 1),
    editor.document.positionAt(end)
  );
}

export function getPositionWithDelta(
  pos: vscode.Position,
  delta: { line: number; character: number }
) {
  return new vscode.Position(
    pos.line + delta.line,
    pos.character + delta.character
  );
}

// export function toVscodeRange({
//   start,
//   end,
// }: {
//   start: number;
//   end: number;
// }): vscode.Range {
//   const editor = vscode.window.activeTextEditor as vscode.TextEditor;

//   return new vscode.Range(
//     editor.document.positionAt(start + 1),
//     editor.document.positionAt(end)
//   );
// }

export function getEditor() {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage("Нет активного текстового редактора");
    throw new Error("Нет активного текстового редактора");
  }

  return editor;
}
