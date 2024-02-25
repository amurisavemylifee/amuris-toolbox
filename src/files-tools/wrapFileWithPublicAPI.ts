import * as vscode from "vscode";
import * as fsp from "fs/promises";
import * as fs from "fs";
import * as path from "path";
import { chooseExtension } from "./helpers";

const getIndexTemplate = (fileNameWithExt: string) => {
  const extension = fileNameWithExt.split(".")[1];
  const fileName = fileNameWithExt.split(".")[0];

  return `import ${fileName} from './${fileName}.${extension}';\n\nexport default ${fileName};`;
};

async function wrapFileWithPublicAPIHandler({ fsPath }: vscode.Uri) {
  if (fsPath === undefined) {
    return;
  }

  const extension = await chooseExtension();

  if (extension === undefined) {
    return;
  }

  const separatedFilePath = fsPath.split("/");
  const fileName = separatedFilePath.at(-1) as string;

  const newFilePath = path.resolve(
    separatedFilePath.slice(1, -1).join("/") + "/" + fileName.split(".")[0]
  );

  if (fs.existsSync(newFilePath)) {
    return vscode.window.showErrorMessage(
      `Ошибка: папка ${fileName.split(".")[0]} уже существует!`
    );
  }

  await fsp.mkdir(newFilePath);

  await fsp.copyFile(fsPath, newFilePath + "/" + fileName);

  await fsp.writeFile(
    newFilePath + "/" + "index." + extension,
    getIndexTemplate(fileName)
  );
  await fsp.rm(fsPath);
}

export const wrapFileWithPublicAPI = vscode.commands.registerCommand(
  "amuris-toolbox.wrapFileWithPublicAPI",
  wrapFileWithPublicAPIHandler
);
