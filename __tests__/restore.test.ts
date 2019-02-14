import { makeRestoreScript, findTargeFilePath, loadAllTemplate } from "../src/restore";
import path = require("path");
import { IRestoreTemplateSet } from "../src/restore.services";
import moment = require("moment");

describe("リストアスクリプトの作成メイン", () => {
  describe("正常系", () => {
    test("DML", async () => {
      const inputpath: string = path.relative("./", "__tests_data__/Case1");
      const result: string[] = await makeRestoreScript(inputpath);

      expect(result).toContain(
        path.resolve(
          `./__tests_data__/Case1/0_PREPARE/ACE_REM_T0900-BACKUP-${moment().format("YYMMDD")}.sql`
        )
      );
      expect(result).toContain(
        path.resolve(
          `./__tests_data__/Case1/9_RESTORE/ACE_REM_T0900-RESTORE-${moment().format("YYMMDD")}.sql`
        )
      );
      expect(result).toContain(
        path.resolve(`./__tests_data__/Case1/9_RESTORE/SP-${moment().format("YYMMDD")}.txt`)
      );
    });
  });

  describe("異常系", () => {
    test("DML", async () => {
      const inputpath: string = path.relative("./", "__tests_data__/Case2");
      const result: string[] = await makeRestoreScript(inputpath);

      expect(result).toContain(
        path.resolve("./__tests_data__/Case2/0_PREPARE/ACE_REM_T0900-BACKUP-12210.sql")
      );
      expect(result).toContain(
        path.resolve("./__tests_data__/Case2/9_RESTORE/ACE_REM_T0900-RESTORE-12210.sql")
      );
    });

    test("0ファイル", async () => {
      const inputpath: string = path.relative("./", "__tests_data__/Case3");
      const result: string[] = await makeRestoreScript(inputpath);
      expect(result).toEqual([]);
    });
  });
});

describe("再帰的にリストア対象のファイルを探索する処理", () => {
  test("対象ファイル有り", async () => {
    const inputpath: string = path.relative("./", "__tests_data__/Case1");
    const result: string[] = await findTargeFilePath(inputpath);

    expect(result).toContain(
      path.resolve("./__tests_data__/Case1/1_DDL/1-1_TABLE/ACE_REM_T0900.sql")
    );
    expect(result).toContain(
      path.resolve("./__tests_data__/Case1/1_DDL/1-1_TABLE/ACE_REM_T0900-ALTER-.sql")
    );
    expect(result).toContain(
      path.resolve("./__tests_data__/Case1/2_SP/2-3_PACKAGE/JPK_REFSEL_100.sql")
    );
    expect(result).toContain(
      path.resolve("./__tests_data__/Case1/2_SP/2-4_PACKAGE BODY/JPK_REFSEL_100B.sql")
    );
    expect(result).toContain(path.resolve("./__tests_data__/Case1/4_DML/ACE_REM_T0900-DATA-.sql"));
  });
});

describe("テンプレートの読み込み", () => {
  test("ファイル名", async () => {
    const tmpl: IRestoreTemplateSet = loadAllTemplate();

    expect(tmpl.BACKUP.name).toBe("${name}-BACKUP-${version}.sql");
    expect(tmpl.RESTORE.name).toBe("${name}-RESTORE-${version}.sql");
  });
});
