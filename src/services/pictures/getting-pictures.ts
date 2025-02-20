import { PictureRepositoryInterface } from "@/repositories";
import { Service } from "@/services";
import { processPictureBuffer } from "@/utils";
import { existsSync } from "node:fs";
import sharp from "sharp";

type GettingPicturesProps = {
  content: Array<string>;
  theme?: "dark" | "white";
  size?: 32 | 48 | 64;
  spacing?: 0 | 5 | 10;
  iconsPerLine?: number;
};

export class GettingPictures
  implements Service<PictureRepositoryInterface, GettingPicturesProps, Buffer>
{
  constructor(public repository: PictureRepositoryInterface) {}

  async run({
    content,
    iconsPerLine,
    size,
    spacing,
    theme,
  }: GettingPicturesProps): Promise<Buffer> {
    const pictures: Array<Buffer<ArrayBufferLike>> = [];

    if (!theme) theme = "dark";
    if (!size) size = 48;
    if (!spacing) spacing = 5;
    if (!iconsPerLine) iconsPerLine = 5;

    content = await this.repository.getPictures(...content);

    for (const picture of content) {
      const selectedTheme = theme === "dark" ? "#242938" : "#f4f2ec";

      const fileExists = existsSync(picture);

      const transparentPicture = await sharp({
        create: {
          width: 1000,
          height: 1000,
          channels: 4,
          background: { alpha: 0, r: 255, g: 255, b: 255 },
        },
      })
        .png()
        .toBuffer();

      const background = `<svg width="${size}" height="${size}">
      <rect x="0" y="0" width="${size}" height="${size}" rx="10" ry="10" fill="${selectedTheme}"/>
    </svg>`;

      pictures.push(
        await sharp(Buffer.from(background))
          .resize(size, size)
          .composite([
            {
              input: await sharp(fileExists ? picture : transparentPicture)
                .resize(size, size)
                .composite([
                  { input: Buffer.from(background), blend: "dest-in" },
                ])
                .toBuffer(),
              blend: "over",
            },
          ])
          .toBuffer()
      );
    }

    const {
      content: compositeContent,
      height,
      width,
    } = processPictureBuffer(pictures, iconsPerLine, size, spacing);

    return await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { alpha: 0, r: 255, g: 255, b: 255 },
      },
    })
      .composite(compositeContent)
      .toFormat("png")
      .toBuffer();
  }
}
