import { makeGettingPicture, makeListPictures } from "@/generators";
import { GetPictureModel } from "@/models/pictures";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

export const pictureRoutes = new Hono();

pictureRoutes.get("/", zValidator("query", GetPictureModel), async (c) => {
  const data = c.req.valid("query");

  const service = makeGettingPicture();

  return c.body(new Uint8Array(await service.run(data)), 200, { "Content-Type": "image/webp" });
});

pictureRoutes.get("/list", async (c) => {
  const service = makeListPictures();

  return c.json(await service.run());
});
