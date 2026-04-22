import app from "./app";
import { PORT } from "./config";

export default {
  port: Number(PORT),
  fetch: app.fetch,
};
