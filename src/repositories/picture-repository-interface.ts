export interface PictureRepositoryInterface {
  uploadPicture(name: string, file: File): Promise<boolean>;
  getPictures(...pictures: Array<string>): Promise<Array<string>>;
  getAll(): Promise<Array<string>>;
}
