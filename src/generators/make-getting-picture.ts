import { PictureRepository } from "@/repositories/local-storage";
import { GettingPictures } from "@/services/pictures";

export function makeGettingPicture(): GettingPictures {
  const repository = new PictureRepository();
  return new GettingPictures(repository);
}
