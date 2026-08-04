import path from "path";
import { rename, unlink } from "node:fs/promises";

export async function moveFile(oldPath: string, newPath: string, cwd: string) {
  const resolvedOld = path.resolve(cwd, oldPath);
  const resolvedNew = path.resolve(cwd, newPath);

  try {
    await rename(resolvedOld, resolvedNew);
    console.log("Файл успешно перемещен");
  } catch (err) {
    console.error("Ошибка при перемещении:", err);
  }
}


export async function deleteFile(filePath: string, cwd: string) {
  const currentPath = path.resolve(cwd, filePath)

  try {
    await unlink(currentPath)
    console.log("Файл успешно удален");
  } catch (err) {
    console.error("Ошибка при удалении:", err);
  }
}
