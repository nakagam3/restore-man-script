/**
 * テンプレートの${key}をvalで置換する処理
 * @param {Object} param 置換文字列のkey:valペア
 * @param {String} tmpl テンプレート文字列、${key}形式で記述
 * @param {String} NULL paramがNullのときに置き換える文字列
 */
export function fillDollarMustache(tmpl: string = "", param: { [key: string]: string }) {
  let result = tmpl;
  for (const key in param) {
    if (param.hasOwnProperty(key)) {
      const regexp = new RegExp(`\\$\\{${key}\\}`, "g");
      result = result.replace(regexp, `${param[key]}`);
    }
  }
  return result;
}
