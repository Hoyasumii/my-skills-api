import { PictureRepository } from "@/repositories/in-memory";
import { ListPictures } from "@/services/pictures";

export function makeListPictures(): ListPictures {
  const repository = new PictureRepository();
  return new ListPictures(repository);
}
