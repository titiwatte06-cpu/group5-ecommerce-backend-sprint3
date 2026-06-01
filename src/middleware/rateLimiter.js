import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 minutes
  max: 100, //Limit each IP for 100 requests
  standardHeaders: true,
  legacyHeaders: false,
});
