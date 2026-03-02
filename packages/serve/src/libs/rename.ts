import * as fs from "node:fs";
import * as path from "node:path";

const bootstrap = async (input: string, output: string) => {
  const basePath =
    "C:\\Users\\ADVANTECH\\Documents\\frontend\\onedrive\\附件\\1202-1204[上海机辆段]";

  const extnames = [".pdf", ".xml", ".ofd"];

  for (const extname of extnames) {
    const oldPath = path.resolve(basePath, input + extname);
    const newPath = path.resolve(basePath, output + extname);
    await fs.promises.rename(oldPath, newPath).catch((error) => {
      console.error(error);
    });
  }
};

bootstrap("25429121050002849758", "火车票-返");
