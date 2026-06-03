import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { errorHandler } from "./middleware/error.middleware.js";
import { connectDB } from "./config/mongoDB.js";
import { router as apiRoutes } from "./routes/index.js";
import { limiter } from "./middleware/rateLimiter.js";
import { corsOptions } from "./config/cors.config.js";

const app = express();
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(limiter);
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send(
    `<!doctype html>
    <html lang="en">
    <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>JSD12 Backend Group5</title>
    </head>
    <body>
    <h1>Group 5 Ecommerce</h1>
    </body>
    </html>`,
  );
});

app.use(errorHandler);

await connectDB();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🌏`);
});
