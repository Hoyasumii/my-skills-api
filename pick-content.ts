import { readdir, readFile, writeFile } from "node:fs/promises";

const dataContent = await readdir("./data");

const responseData: Record<string, string> = {};

for await (const targetFile of dataContent) {
  if (!targetFile.endsWith(".svg")) continue;

  responseData[targetFile.split(".")[0]] = (
    await readFile(`data/${targetFile}`)
  ).toString("utf-8");
}

await writeFile(
  "./src/repositories/in-memory/database.ts",
  "export default " + JSON.stringify(responseData, null, 2)
);
