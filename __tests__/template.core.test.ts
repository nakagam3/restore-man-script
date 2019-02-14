import { fillDollarMustache } from "../src/template.core";

describe("テンプレートSQLをパラメータで置換する処理", () => {
  describe("BACKUPスクリプト", () => {
    test("SQL", () => {
      expect(
        fillDollarMustache(
          "CREATE TABLE ${name}_JV${version}BK NOLOGGING PARALLEL AS SELECT * FROM ${name};",
          {
            name: "ACE_REM_T0900",
            version: "123456"
          }
        )
      ).toBe(
        "CREATE TABLE ACE_REM_T0900_JV123456BK NOLOGGING PARALLEL AS SELECT * FROM ACE_REM_T0900;"
      );
    });

    test("ファイル名", () => {
      expect(
        fillDollarMustache("${name}-BACKUP-${version}.sql", {
          name: "ACE_REM_T0900",
          version: "012345"
        })
      ).toBe("ACE_REM_T0900-BACKUP-012345.sql");
    });
  });

  describe("RESTOREスクリプト", () => {
    test("SQL", () => {
      expect(
        fillDollarMustache(
          "Truncate Table ${name}; Insert Into ${name} Select * From ${name}_JV${version}BK;",
          {
            name: "ACE_REM_T0900",
            version: "121222"
          }
        )
      ).toBe(
        "Truncate Table ACE_REM_T0900; Insert Into ACE_REM_T0900 Select * From ACE_REM_T0900_JV121222BK;"
      );
    });
  });
});
