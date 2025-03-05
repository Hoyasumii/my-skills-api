import app from "./app";
import { serve } from "@hono/node-server";

serve(
  {
    fetch: app.fetch,
    port: parseInt(process.env.PORT),
  },
  (info) => {
    console.log(`Server is running on http://${info.address}:${info.port}`);
  }
);
