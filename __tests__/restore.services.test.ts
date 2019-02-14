import path = require("path");
import { assignJob, applyRestoreRule } from "../src/restore.services";
import { File } from "../src/files.core";
import moment = require("moment");

describe("ファイルパスからジョブを判定する処理", () => {
  test("ALTERの場合", () => {
    expect(
      assignJob("__tests_data__/Case1/1_DDL/1-1_TABLE/ACE_REM_T0900-ALTER-1.22.1.0.sql")
    ).toEqual([]);
  });

  test("DMLの場合", () => {
    expect(assignJob("__tests_data__/Case1/4_DML/ACE_REM_T0900-DATA.sql")).toEqual([
      "BACKUP",
      "RESTORE"
    ]);
  });

  test("SPの場合", () => {
    expect(assignJob("__tests_data__/Case1/2_SP/2-4_PACKAGE BODY/JPK_REFSEL_100.sql")).toEqual([
      "SP"
    ]);
  });
});

describe("ファイルパスからリストアスクリプトを作成する処理", () => {
  const RestoreTemplate: { [job: string]: File } = {
    BACKUP: {
      name: "${name}-BACKUP-${version}.sql",
      dirpath: "static/template/Restore",
      text: "CREATE TABLE ${name}_JV${version}BK NOLOGGING PARALLEL AS SELECT * FROM ${name};"
    },
    RESTORE: {
      name: "${name}-RESTORE-${version}.sql",
      dirpath: "static/template/Restore",
      text: "Truncate Table ${name}; Insert Into ${name} Select * From ${name}_JV${version}BK;"
    }
  };

  describe("フルパラメータ", () => {
    test("ALTERの場合", () => {
      const files: File[] = applyRestoreRule(
        path.resolve("./__tests_data__/Case1/1_DDL/1-1_TABLE/ACE_REM_T0900-ALTER-1.22.1.0.sql"),
        RestoreTemplate
      );
      expect(files[0]).toBeUndefined();
    });

    test("DMLの場合", () => {
      const files: File[] = applyRestoreRule(
        path.resolve("./__tests_data__/Case1/4_DML/ACE_REM_T0900-DATA-1.22.1.0.sql"),
        RestoreTemplate
      );
      expect(files[0].text).toBe(
        "CREATE TABLE ACE_REM_T0900_JV12210BK NOLOGGING PARALLEL AS SELECT * FROM ACE_REM_T0900;"
      );
      expect(files[1].text).toBe(
        "Truncate Table ACE_REM_T0900; Insert Into ACE_REM_T0900 Select * From ACE_REM_T0900_JV12210BK;"
      );
    });
  });

  describe("version無し", () => {
    test("-有り", () => {
      const files: File[] = applyRestoreRule(
        path.resolve("./__tests_data__/Case1/4_DML/ACE_REM_T0900-DATA-.sql"),
        RestoreTemplate
      );
      expect(files[0].text).toBe(
        `CREATE TABLE ACE_REM_T0900_JV${moment().format(
          "YYMMDD"
        )}BK NOLOGGING PARALLEL AS SELECT * FROM ACE_REM_T0900;`
      );
    });

    test("-無し", () => {
      const files: File[] = applyRestoreRule(
        path.resolve("./__tests_data__/Case1/4_DML/ACE_REM_T0900-DATA.sql"),
        RestoreTemplate
      );
      expect(files[0].text).toBe(
        `CREATE TABLE ACE_REM_T0900_JV${moment().format(
          "YYMMDD"
        )}BK NOLOGGING PARALLEL AS SELECT * FROM ACE_REM_T0900;`
      );
    });
  });
});
