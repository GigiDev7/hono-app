import { Hono } from "hono";
import { facility } from "./routers/facilities";
import { cors } from "hono/cors";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.route("/facility", facility);

export default app;
