import express from "express";
import cors from "cors";
import { router } from "./router.js";
import { errorHandler } from "./middlewares/errorHandler.js";
// @ts-ignore
import { xss } from "express-xss-sanitizer";


export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(xss());

// Autorisera tous les fetch depuis les localhost, les ip 127.0.0.1 ou la-pince-front-production.up.railway.app
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      /^(http:\/\/localhost:\d+|http:\/\/127\.0\.0\.1:\d+)$/,
      "https://la-pince-front-production.up.railway.app"
    ];

    if (!origin || allowedOrigins.some(pattern => typeof pattern === "string" ? pattern === origin : pattern.test(origin))) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));

app.use(router);

app.use(errorHandler);