restore-man-script
====

リリーススクリプトからリストアスクリプトを自動生成するnodejsスクリプト。



## 作成できるリストアスクリプト



- BACKUP/RESTORE

  BACKUPでテーブルのコピーを作成、RESTOREで元テーブルの洗い替えを行うSQLを出力する。

- SP（リストアップのみ）

  変更されるSPのファイル名を一覧にしたテキストを出力する。
  → 瀧口さんのバックアップツールで自動バックアップ可能？



## リリーススクリプトの命名規則

下記の命名規則でファイルが作られていればリストアスクリプトを自動で生成可能。

| 処理内容 | 命名規則                   | リストアスクリプト |
| -------- | -------------------------- | ------------------ |
| CREATE   | ACE_XXX_TXXXX              | 無し               |
| ALTER文  | ACE_XXX_TXXXX-ALTER-000000 | 無し               |
| DML      | ACE_XXX_TXXXX-DATA-000000  | BACKUP/RESTORE     |
| SP       | JPR_XXX000                 | SP                 |
| SP       | JFN_XXX000                 | SP                 |
| SP       | JPK_XXXXXX_000(B)          | SP                 |
| JOB      | JOB_XXXXXX_XXX             | 無し               |

