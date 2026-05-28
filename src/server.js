import express from "express";
import { errorHandler } from "./middleware/error.middleware.js";

import { connectDB } from "./config/mongoDB.js";
import { router as apiRoutes } from "./routes/index.js";

const app = express();
app.use(express.json());
app.use("/api", apiRoutes);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send(
    `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>JSD12 Backend Assessment</title>
    </head>
    <body>
      <h1>Group 5 Ecommerce</h1>
    </body>
  </html>`,
  );
});

await connectDB();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🌏`);
});
