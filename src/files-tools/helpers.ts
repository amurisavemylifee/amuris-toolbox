import * as vscode from "vscode";
import { EXTENSIONS } from "./models";

export async function chooseExtension() {
  return await vscode.window.showQuickPick(EXTENSIONS, {
    placeHolder: "Выберите вариант",
  });
}
