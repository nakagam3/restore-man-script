import "@babel/polyfill";
import path = require("path");
import { outputFileSync, readdirpSync, File, loadFileSync, makeEmptyFile } from "./files.core";
import { applyRestoreRule, IRestoreTemplateSet } from "./restore.services";

export async function makeRestoreScript(inputpath: string): Promise<string[]> {
  const targetFilePathList: string[] = await findTargeFilePath(inputpath);

  const RestoreTemplate: IRestoreTemplateSet = loadAllTemplate();
  const restoreFileList = targetFilePathList.flatMap((filepath: string) => {
    return applyRestoreRule(filepath, RestoreTemplate);
  });

  return outputRestoreScript(restoreFileList, makeOutputDirPath(inputpath));
}

export async function findTargeFilePath(filepath: string): Promise<string[]> {
  const findFiles: string[] = await Promise.resolve(readdirpSync(filepath));
  return findFiles.filter(f => f.match(/[.](SQL|sql)$/g));
}

export function loadAllTemplate(): IRestoreTemplateSet {
  return {
    BACKUP: loadFileSync(path.resolve("./static/template/Restore/${name}-BACKUP-${version}.sql")),
    RESTORE: loadFileSync(path.resolve("./static/template/Restore/${name}-RESTORE-${version}.sql")),
    SP: loadFileSync(path.resolve("./static/template/Restore/SP-${version}.txt"))
  };
}

function makeOutputDirPath(inputpath: string): string {
  return path.resolve("./", inputpath);
}

function outputRestoreScript(files: File[], outputDir: string) {
  // SP系はひとつのファイルにまとめる
  const rolluped = rollupSPScript(files);
  return rolluped.map(file => {
    // 出力先を再設定
    file.dirpath = path.join(outputDir, file.dirpath);
    outputFileSync(file);
    return path.join(file.dirpath, file.name);
  });
}

function rollupSPScript(files: File[]): File[] {
  let noSPFiles: File[] = files.filter(f => !f.name.match(/SP/g));

  const spFiles: File[] = files.filter(f => f.name.match(/SP/g)) || [];
  if (spFiles.length) {
    const rollupedFile: File = spFiles.reduce((a, b) => {
      let tmp: File = Object.assign(makeEmptyFile(), b);
      tmp.text = [a.text, b.text].join("\n");
      return tmp;
    }, makeEmptyFile());
    noSPFiles.push(rollupedFile);
  }

  return noSPFiles;
}
