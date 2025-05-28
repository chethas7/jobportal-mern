import "./config/instrument.js";
import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDatabase from "./config/database.js";
import * as Sentry from "@sentry/node";
import clerkWebhooks from "./controller/webHooks.js";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT;

// Connect to MongoDB
await connectDatabase();

// CORS
app.use(cors());

// 🔥 RAW BODY middleware only for Clerk Webhooks (MUST be before express.json())

app.use("/api/webhook/clerk", bodyParser.raw({ type: "application/json" }));

// Normal JSON body parsing for all other routes
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("API Running");
});

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});

// Clerk Webhook
app.post("/api/webhook/clerk", clerkWebhooks);

// Sentry Error Handler
Sentry.setupExpressErrorHandler(app);

// Start server
app.listen(PORT, () => {
  console.log(`Server Running at ${PORT}`);
});
