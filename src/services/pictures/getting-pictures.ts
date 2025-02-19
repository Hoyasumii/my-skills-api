import { PictureRepositoryInterface } from "@/repositories";
import { PictureRepository } from "@/repositories/local-storage";
import { Service } from "@/services";
import { existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import process from "node:process";

type GettingPicturesProps = {
  content: Array<string>;
  theme?: "dark" | "white";
  size?: 32 | 48 | 64;
  spacing?: 0 | 5 | 10;
  iconsPerLine?: number;
};

// TODO: Armazenar o SVG em outro canto
// TODO: Levar o Script de distribuição de grid

export class GettingPictures
  implements Service<PictureRepositoryInterface, GettingPicturesProps, unknown>
{
  constructor(public repository: PictureRepositoryInterface) {}

  async run({
    content,
    iconsPerLine,
    size,
    spacing,
    theme,
  }: GettingPicturesProps): Promise<unknown> {
    const pictures: Array<Buffer<ArrayBufferLike>> = [];

    if (!theme) theme = "dark";
    if (!size) size = 48;
    if (!spacing) spacing = 5;
    if (!iconsPerLine) iconsPerLine = 1;

    for (const picture of content) {
      const currentPath = join(process.env.PWD!, `data//${picture}.png`);

      const selectedTheme = theme === "dark" ? "#242938" : "#f4f2ec";

      if (!existsSync(currentPath)) throw new Error();

      const svg = `<svg width="${size}" height="${size}">
      <rect x="0" y="0" width="${size}" height="${size}" rx="10" ry="10" fill="${selectedTheme}"/>
    </svg>`;

      pictures.push(
        await sharp(Buffer.from(svg))
          .resize(size, size)
          .composite([
            {
              input: await sharp(currentPath)
                .resize(size, size)
                .composite([{ input: Buffer.from(svg), blend: "dest-in" }])
                .toBuffer(),
              blend: "over",
            },
          ])
          .toBuffer()
      );
    }

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

    console.log(
      await sharp({
        create: {
          width,
          height,
          channels: 4,
          background: { alpha: 0, r: 255, g: 255, b: 255 },
        },
      })
        .composite(compositeContent)
        .toFile(join(process.env.PWD!, "testing.png"))
    );

    return;
  }
}

(async () => {
  await new GettingPictures(new PictureRepository()).run({
    content: [
      "hono",
      "typescript",
      "hono",
      "typescript",
      "hono",
      "typescript",
      "hono",
      "typescript",
    ],
    iconsPerLine: 3,
    size: 48,
    spacing: 5,
    theme: "dark",
  });
})();
