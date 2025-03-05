export interface PictureRepositoryInterface {
  getPictures(...pictures: Array<string>): Promise<Array<string>>;
  getAll(): Promise<Array<string>>;
}
