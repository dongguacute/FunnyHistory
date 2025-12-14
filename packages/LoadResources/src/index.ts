import * as fs from "fs";
import * as path from "path";

export const loadResources = (filename: string, number: string) => {
  const filePath = path.resolve(__dirname, filename);
  const fileContent = fs.readFileSync('./content'+filePath, 'utf-8');

  //读取文件内容并返回指定段落的内容
  const type = fileContent.split('part-'+'-'+number)["type"];
  const text = fileContent.split('part-'+'-'+number)["text"];
  const effect = fileContent.split('part-'+'-'+number)["effect"];
  const photo = fileContent.split('part-'+'-'+number)["photo"];
  const audio = fileContent.split('part-'+'-'+number)["audio"];
  return {
    type,
    text,
    effect,
    photo,
    ...(photo ? { photo } : {}),
    ...(audio ? { audio } : {})
  }

};
