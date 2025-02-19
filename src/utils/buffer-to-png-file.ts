export function bufferToPngFile(targetBuffer: Buffer<ArrayBufferLike>): File {
  const blob = new Blob([targetBuffer]);
  return new File([blob], "file.png", { type: "image/png" });
}
