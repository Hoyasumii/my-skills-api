import "dotenv/config";
import { createReadStream } from "fs";
import { Hono } from "hono";
import { stream } from "hono/streaming";

const app = new Hono();

app.get("/", async (c) => {
  return stream(c, async (stream) => {
    const pictureStream = createReadStream("./data/hono.png");

    stream.onAbort(() => {});

    for await (const chunk of pictureStream) {
      stream.write(chunk);
    }

    stream.close();
  });

});

export default app;
