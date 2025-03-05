import { PictureRepository } from "@/repositories/local-storage";
import { ListPictures } from "@/services/pictures";

export function makeListPictures(): ListPictures {
  const repository = new PictureRepository();
  return new ListPictures(repository);
}