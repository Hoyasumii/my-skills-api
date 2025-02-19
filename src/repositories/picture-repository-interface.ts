export interface PictureRepositoryInterface {
  uploadPicture(name: string, file: File): Promise<boolean>;
  getPicture(name: string): Promise<Buffer>;
}
