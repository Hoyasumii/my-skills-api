import process from "node:process";
import { PictureRepositoryInterface } from "@/repositories";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export class PictureRepository implements PictureRepositoryInterface {
  public pwd = process.env.PWD!;

  async uploadPicture(name: string, file: File): Promise<boolean> {
    const newFilePath = path.join(this.pwd, `data/${name}`);
    const fileBuffer = await file.arrayBuffer();

    await writeFile(newFilePath, Buffer.from(fileBuffer));

    return true;
  }

  async getPicture(name: string): Promise<Buffer> {
    const targetFile = path.join(this.pwd, `data/${name}`);

    const fileBuffer = await readFile(targetFile);

    return Buffer.from(fileBuffer);
  }
}
