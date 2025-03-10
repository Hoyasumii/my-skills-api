import { PictureRepository } from "@/repositories/in-memory";
import { GettingPictures } from "@/services/pictures";

export function makeGettingPicture(): GettingPictures {
  const repository = new PictureRepository();
  return new GettingPictures(repository);
}
