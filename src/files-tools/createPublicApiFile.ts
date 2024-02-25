import * as vscode from "vscode";
import * as fsp from "fs/promises";
import * as fs from "fs";
import * as path from "path";
import ts from "typescript";
import { EXTENSIONS } from "./models";

async function getFilesExports(folderPath: string, mainFolderPath: string) {
  const relPath = path.relative(mainFolderPath, folderPath);
  const folderContent = await fsp.readdir(folderPath);

  const vueFiles: {
    name: string;
    path: string;
  }[] = [];

  const otherFiles: {
    imports: string[];
    defaultImport?: string;
    path: string;
  }[] = [];

  if (
    (folderPath !== mainFolderPath && folderContent.includes("index.ts")) ||
    folderContent.includes("index.js")
  ) {
    let code = "";

    if (folderContent.includes("index.js")) {
      code = await fsp.readFile(folderPath + "/index.js", {
        encoding: "utf-8",
      });
    } else if (folderContent.includes("index.ts")) {
      code = await fsp.readFile(folderPath + "/index.ts", {
        encoding: "utf-8",
      });
    }

    const ast = ts.createSourceFile(
      "example.ts",
      code,
      ts.ScriptTarget.Latest,
      true
    );

    ast.statements
      .filter((item) => {
        return (
          item.kind === ts.SyntaxKind.ExportDeclaration ||
          item.kind === ts.SyntaxKind.FunctionDeclaration ||
          item.kind === ts.SyntaxKind.VariableStatement ||
          item.kind === ts.SyntaxKind.ExportAssignment ||
          item.kind === ts.SyntaxKind.TypeAliasDeclaration ||
          item.kind === ts.SyntaxKind.InterfaceDeclaration
        );
      })
      .filter((item) => {
        if (
          item.kind === ts.SyntaxKind.VariableStatement ||
          item.kind === ts.SyntaxKind.TypeAliasDeclaration ||
          item.kind === ts.SyntaxKind.InterfaceDeclaration ||
          item.kind === ts.SyntaxKind.FunctionDeclaration
        ) {
          const itemWithModifiers = item as
            | ts.VariableStatement
            | ts.TypeAliasDeclaration
            | ts.InterfaceDeclaration
            | ts.FunctionDeclaration;

          return itemWithModifiers.modifiers?.some(
            (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
          );
        } else if (
          item.kind === ts.SyntaxKind.ExportAssignment ||
          item.kind === ts.SyntaxKind.ExportDeclaration
        ) {
          return true;
        }
        return false;
      });

    return [];
  }

  for (const item of folderContent) {
    const splittedName = item.split(".");

    if (splittedName.length === 2 && splittedName[1] === "vue") {
      const filePath = "./" + (relPath ? relPath + "/" : "") + item;
      vueFiles.push({ name: splittedName[0], path: filePath });
    }

    if (
      splittedName.length === 2 &&
      (splittedName[1] === "ts" || splittedName[1] === "js")
    ) {
      // const filePath = "./" + (relPath ? relPath + "/" : "") + item;
      // const code = await fsp.readFile(folderPath + "/" + item, {
      //   encoding: "utf-8",
      // });
      // const ast = ts.createSourceFile(
      //   "example.ts",
      //   code,
      //   ts.ScriptTarget.Latest,
      //   true
      // );
      // console.log(ast.statements.filter((statement) => {
      //   return statement.kind === ts.SyntaxKind.ExportDeclaration
      // }));
      // otherFiles.push({ imports: splittedName[0],defaultImport: splittedName[0], path: filePath });
    }

    if (splittedName.length === 1) {
      const nestedFiles = await getFilesExports(
        path.join(folderPath, item),
        mainFolderPath
      );

      vueFiles.push(...nestedFiles);
    }
  }

  return vueFiles;
}

async function createPublicApiFileHandler(folder: vscode.Uri) {
  const vueFiles: {
    name: string;
    path: string;
  }[] = [];

  vueFiles.push(...(await getFilesExports(folder.path, folder.path)));

  let barrelText = "";

  vueFiles.forEach((file) => {
    barrelText += `import ${file.name} from "${file.path}";\n`;
  });
  barrelText += "\n";
  barrelText += `export { ${vueFiles.map((file) => file.name).join(", ")} };`;

  const extension = await vscode.window.showQuickPick(EXTENSIONS, {
    placeHolder: "Выберите варианты",
  });

  if (extension === undefined) {
    return;
  }

  if (fs.existsSync(folder.path + "/index.ts")) {
    await fsp.rm(folder.path + "/index.ts");
  }

  if (fs.existsSync(folder.path + "/index.js")) {
    await fsp.rm(folder.path + "/index.js");
  }

  await fsp.writeFile(folder.path + "/index" + extension, barrelText);
}

export const createPublicApiFile = vscode.commands.registerCommand(
  "amuris-toolbox.createPublicApiFile",
  createPublicApiFileHandler
);
