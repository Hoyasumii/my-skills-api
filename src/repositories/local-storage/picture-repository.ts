import process from "node:process";
import { PictureRepositoryInterface } from "@/repositories";
import { readdir } from "node:fs/promises";
import path from "node:path";

export class PictureRepository implements PictureRepositoryInterface {
  public pwd = process.env.PWD!;

  async getPictures(...pictures: Array<string>): Promise<Array<string>> {
    pictures = pictures.map((picture) =>
      path.join(this.pwd, `data/${picture}.svg`)
    );

    return pictures;
  }

  async getAll(): Promise<Array<string>> {
    let content: Array<string> = await readdir(path.join(this.pwd, "data"));

    content = content.map((item) => item.split(".")[0]);

    return content;
  }
}
