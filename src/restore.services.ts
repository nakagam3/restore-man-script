import path = require("path");
import moment = require("moment");
import { File, makeEmptyFile } from "./files.core";
import { fillDollarMustache } from "./template.core";

const _rules: {
  [key: string]: {
    regexp: RegExp;
    dirname: string;
  };
} = {
  BACKUP: {
    regexp: new RegExp(`ACE_[A-Z0-9]{3}_(T|V)[0-9]{4}(.?)(_.+?)*-DATA`, "g"),
    dirname: "0_PREPARE"
  },
  RESTORE: {
    regexp: new RegExp(`ACE_[A-Z0-9]{3}_(T|V)[0-9]{4}(.?)(_.+?)*-DATA`, "g"),
    dirname: "9_RESTORE"
  },
  SP: {
    regexp: new RegExp(`(JFN|JPR|JPK)_RE(F|M|C)(.?){3}(_)[0-9]{3}(.?)(_.+?)*`, "g"),
    dirname: "9_RESTORE"
  }
};

export interface IRestoreTemplateSet {
  [job: string]: File;
}

export function applyRestoreRule(filepath: string, template: IRestoreTemplateSet): File[] {
  const jobList = assignJob(filepath);
  const param: { [key: string]: string } = parameterize(filepath);

  return jobList.map((job: string) => {
    const tmpl: File = template[job] || makeEmptyFile();
    const name: string = fillDollarMustache(tmpl.name, param);
    const dirpath: string = _rules[job].dirname;
    const text: string = fillDollarMustache(tmpl.text, param);

    return { name, dirpath, text };
  });
}

export function assignJob(filepath: string): string[] {
  let jobList: string[] = [];

  const jobs: string[] = Object.keys(_rules);
  for (const job of jobs) {
    const regexp: RegExp = _rules[job].regexp;
    if (filepath.match(regexp)) {
      jobList.push(job);
    }
  }

  return jobList;
}

export function parameterize(filepath: string): { [key: string]: string } {
  const filename: string = path.basename(filepath, path.extname(filepath));
  const parts: string[] = filename.split("-");
  return {
    name: parts[0] || "",
    type: parts[1] || "",
    version: parts[2] ? parts[2].split(".").join("") : moment().format("YYMMDD")
  };
}
