import { PictureRepositoryInterface } from "@/repositories";
import database from "./database";

export class PictureRepository implements PictureRepositoryInterface {
  private data: Record<string, string> = database;

  async exists(key: string): Promise<boolean> {
    return this.data[key] === undefined;
  }

  async getAll(): Promise<Array<string>> {
    return Object.keys(this.data);
  }

  async getPictures(...pictures: Array<string>): Promise<Array<string>> {
    const returnContent: Array<string> = [];

    pictures.forEach((picture) => {
      returnContent.push(this.data[picture]);
    });

    return returnContent;
  }
}
