import * as vscode from "vscode";
import * as fsp from "fs/promises";
import * as fs from "fs";
import { chooseExtension } from "./helpers";

type UtilsListItem = {
  name: string;
  value: string;
  type: "folder" | "file";
};

const UTILS_LIST: UtilsListItem[] = [
  { name: "components (папка)", value: "components", type: "folder" },
  { name: "helpers (файл)", value: "helpers", type: "file" },
  { name: "types (файл)", value: "types", type: "file" },
  { name: "models (файл)", value: "models", type: "file" },
  { name: "validation (файл)", value: "validation", type: "file" },
  { name: "index (файл)", value: "index", type: "file" },
];

const QUICK_PICK_ITEMS = UTILS_LIST.map((item) => {
  return item.name;
});

async function createFile(mainFolderPath: string, fileName: string) {
  let newFilePath = mainFolderPath + "/" + fileName;

  const extension = await chooseExtension();

  const newPathWithExtension = newFilePath + "." + extension;

  if (
    fs.existsSync(newFilePath + ".ts") ||
    fs.existsSync(newFilePath + ".js")
  ) {
    return vscode.window.showErrorMessage(
      `Ошибка: файл ${fileName} уже существует!`
    );
  }

  await fsp.writeFile(newPathWithExtension, "");
}

async function createFolder(mainFolderPath: string, newFolderName: string) {
  const newFolderPath = mainFolderPath + "/" + newFolderName;

  await fsp.mkdir(newFolderPath);
}

async function createUtilFileHandler({ path }: vscode.Uri) {
  if (path === undefined) {
    return;
  }

  const selectedUtilName = await vscode.window.showQuickPick(QUICK_PICK_ITEMS, {
    placeHolder: "Выберите вариант",
  });

  if (selectedUtilName === undefined) {
    return;
  }

  const selectedUtilItem = UTILS_LIST.find(
    (item) => item.name === selectedUtilName
  ) as UtilsListItem;

  if (selectedUtilItem.type === "folder") {
    await createFolder(path, selectedUtilItem.value);
  }

  if (selectedUtilItem.type === "file") {
    await createFile(path, selectedUtilItem.value);
  }
}

export const createUtilFile = vscode.commands.registerCommand(
  "amuris-toolbox.createUtilFile",
  createUtilFileHandler
);
