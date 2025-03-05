import { GetPictureModel } from "@/models/pictures";
import { PictureRepositoryInterface } from "@/repositories";
import { Service } from "@/services";
import { processPictureBuffer } from "@/utils";
import { existsSync } from "node:fs";
import sharp from "sharp";

export class GettingPictures
  implements Service<PictureRepositoryInterface, GetPictureModel, Buffer>
{
  constructor(public repository: PictureRepositoryInterface) {}

  async run({
    icons,
    iconsPerLine,
    size,
    spacing,
    theme,
  }: GetPictureModel): Promise<Buffer> {
    const pictures: Array<Buffer> = [];

    if (icons[0] === "all") icons = await this.repository.getAll();

    icons = await this.repository.getPictures(...icons);

    for (const picture of icons) {
      const selectedTheme = theme === "dark" ? "#1f2937" : "#e5e7eb";

      const fileExists = existsSync(picture);

      const transparentPicture = await sharp({
        create: {
          width: 512,
          height: 512,
          channels: 4,
          background: { alpha: 0, r: 255, g: 255, b: 255 },
        },
      })
        .webp()
        .toBuffer();

      const background = `<svg width="512" height="512">
        <rect x="0" y="0" width="512" height="512" rx="50" ry="50" fill="${selectedTheme}"/>
      </svg>`;

      const resizedImage = await sharp(
        fileExists ? picture : transparentPicture
      )
        .resize(size, size)
        .toFormat("webp")
        .toBuffer();

      pictures.push(
        await sharp(Buffer.from(background))
          .resize(size, size)
          .composite([
            {
              input: resizedImage,
              blend: "over",
            },
          ])
          .toBuffer()
      );
    }

    const {
      content: compositeicons,
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
      .composite(compositeicons)
      .toFormat("webp")
      .toBuffer();
  }
}
