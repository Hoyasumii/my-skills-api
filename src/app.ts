import "dotenv/config";
import { Hono } from "hono";
import { PictureRepository } from "./repositories/local-storage";
import { GettingPictures } from "./services/pictures/getting-pictures";

const app = new Hono();

app.get("/", async (c) => {
  // ?i=bla,ble,bli&theme=dark&size=32&spacing=5&iconsPerLine=2

  const { i, theme, size, spacing, iconsPerLine } = await c.req.query();

  const repo = new PictureRepository();
  const service = new GettingPictures(repo);

  if (i === undefined) return c.text("false");

  const pictureStream = await service.run({
    content: i.split(","),
    theme: theme as "dark",
    size: size === undefined ? undefined : (parseInt(size) as 48),
    spacing: spacing === undefined ? undefined : (parseInt(spacing) as 5),
    iconsPerLine:
      iconsPerLine === undefined ? undefined : parseInt(iconsPerLine),
  });

  return c.body(pictureStream, 200, { "Content-Type": "image/png" });
});

export default app;
