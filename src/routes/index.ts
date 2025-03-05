import { Hono } from "hono";
import { pictureRoutes } from "./picture-routes";

const routes = new Hono();

routes.route("/", pictureRoutes);

export default routes;
