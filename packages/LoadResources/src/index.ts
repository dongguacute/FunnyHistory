import * as fs from "fs";
import * as path from "path";

export const loadResources = (filename: string, part: string) => {
  const filePath = path.resolve(__dirname, filename);
  const fileContent = fs.readFileSync('./content'+filePath, 'utf-8');
  return fileContent.split(part);
};
