import "./config/instrument.js";
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDatabase from "./config/database.js";
import * as Sentry from "@sentry/node";
import clerkWebhooks from "./controller/webHooks.js";

const app = express();
const PORT = process.env.PORT;
await connectDatabase();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running");
});
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
app.post("/webhooks", clerkWebhooks);

Sentry.setupExpressErrorHandler(app);
app.listen(PORT, () => {
  console.log(`Server Running at ${PORT}`);
});
