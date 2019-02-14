import path = require("path");
import iconv = require("iconv-lite");
import recursive = require("recursive-readdir");
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";

export interface File {
  name: string;
  dirpath: string;
  text: string;
}

export function makeEmptyFile(): File {
  return {
    name: "",
    dirpath: "",
    text: ""
  };
}

export function loadFileSync(
  filepath: string,
  { charset }: { charset: string } = { charset: "utf-8" }
): File {
  const _filepath: string = path.resolve(filepath);
  const data = readFileSync(_filepath);
  return {
    name: path.basename(_filepath),
    dirpath: path.dirname(_filepath),
    text: iconv.decode(Buffer.from(data), charset)
  };
}

export function outputFileSync(
  file: File,
  { charset }: { charset: string } = { charset: "utf-8" }
): void {
  const filepath: string = path.join(file.dirpath, file.name);
  if (filepath) {
    mkdirRecursiveSync(path.resolve(filepath, "../"));
    writeFileSync(filepath, iconv.encode(file.text, charset));
  }
}

export function mkdirRecursiveSync(dirpath: string) {
  if (!existsSync(dirpath)) {
    mkdirSync(dirpath, { recursive: true });
  }
}

export async function readdirpSync(dirpath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    recursive(dirpath).then(
      function(files) {
        const pathlist = files || [];
        resolve(pathlist.map(p => path.resolve(p)));
      },
      function(error) {
        console.error("something exploded", error);
        reject(error);
      }
    );
  });
}
