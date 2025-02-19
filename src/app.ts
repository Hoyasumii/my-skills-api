import "dotenv/config";
import { Hono } from "hono";
import { PictureRepository } from "./repositories/local-storage";
import { GettingPictures } from "./services/pictures/getting-pictures";
import { writeFile } from "fs/promises";

const app = new Hono();

app.get("/", async (c) => {
  const repo = new PictureRepository();
  const service = new GettingPictures(repo);

  const pictureStream = await service.run({
    content: ["hono", "typescript"],
    size: 48,
    iconsPerLine: 2,
  });

  await writeFile("./test.png", pictureStream);

  return c.body(pictureStream, 200, { "Content-Type": "image/png" })
});

export default app;
