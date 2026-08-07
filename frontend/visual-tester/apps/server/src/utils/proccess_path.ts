import path from "path";
export function proccess_path(reportPath: string) {

  const lastPathName = path.basename(reportPath);

  // Extract everything before "-test"
  const beforeTest = lastPathName.match(/^(.*?)-test/)?.[1] ?? lastPathName;

  return beforeTest

}
