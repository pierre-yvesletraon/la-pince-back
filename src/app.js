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

// Autorisera tous les fetch depuis les localhost ou les ip 127.0.0.1
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || /^(http:\/\/localhost:\d+|http:\/\/127\.0\.0\.1:\d+)$/.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));

app.use(router);

app.use(errorHandler);