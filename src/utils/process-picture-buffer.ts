import sharp from "sharp";

type ProcessPictureBufferReturn = {
  width: number;
  height: number;
  content: Array<sharp.OverlayOptions>;
};

export function processPictureBuffer(
  pictures: Array<Buffer>,
  iconsPerLine: number,
  size: number,
  spacing: number
): ProcessPictureBufferReturn {
  const compositeContent: Array<sharp.OverlayOptions> = [];

  const baseWidth =
    pictures.length > iconsPerLine ? iconsPerLine : pictures.length;

  const totalRows = Math.ceil(pictures.length / iconsPerLine);
  const width = baseWidth * size + (baseWidth - 1) * spacing;
  const height = totalRows * size + (totalRows - 1) * spacing;

  pictures.forEach((picture, index) => {
    const row = Math.floor(index / iconsPerLine);
    const col = index % iconsPerLine;

    const top = row * (size + spacing);
    const left = col * (size + spacing);

    compositeContent.push({
      input: picture,
      top,
      left,
    });
  });

  return {
    content: compositeContent,
    width,
    height,
  };
}
