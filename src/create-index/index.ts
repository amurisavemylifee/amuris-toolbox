import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

const createIndexTemplate = (fileName: string, extension: string) =>
  `import ${fileName} from './${fileName}.${extension}';\nexport default ${fileName};`;

export const createIndex = vscode.commands.registerCommand(
  "amuris-toolbox.createIndex",
  (file: vscode.Uri) => {
    const splitedFilePath = file.path.split("/");
    const fileName = splitedFilePath[splitedFilePath.length - 1];
    const joinedFolderPath = splitedFilePath.slice(1, -1).join("/");

    const newFilePath = path.resolve(joinedFolderPath + "/" + fileName.split(".")[0]);

    console.log(file);

    if (splitedFilePath[splitedFilePath.length - 1].split(".").length === 1) {
      return vscode.window.showErrorMessage("Нужно выбрать файл!");
    }

    if (splitedFilePath[splitedFilePath.length - 1].split(".")[1] !== "vue") {
      return vscode.window.showErrorMessage("Поддерживаются только файлы расширения .vue");
    }

    if (fs.existsSync(newFilePath)) {
      return vscode.window.showErrorMessage(`Папка ${fileName.split(".")[0]} уже создана!`);
    }

    fs.mkdir(newFilePath, (err) => {
      console.log(err);
    });

    fs.copyFile(file.fsPath, newFilePath + "/" + fileName, (err) => {
      console.log(err);
    });

    fs.writeFile(
      newFilePath + "/" + "index.js",
      createIndexTemplate(fileName.split(".")[0], fileName.split(".")[1]),
      (err) => {
        console.log(err);
      }
    );

    fs.rm(file.fsPath, (err) => {
      console.log(err);
    });
  }
);
