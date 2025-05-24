import express from "express";
import cors from "cors";
import { router } from "./router.js";
import { errorHandler } from "./middlewares/errorHandler.js";
// @ts-ignore
import { xss } from "express-xss-sanitizer";
import swaggerRoutes from "./docs/routes.swagger.js";

/**
 * Configures and exports the Express application.
 */
export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(xss());

// Autorisera tous les fetch depuis les localhost, les ip 127.0.0.1 ou la-pince-front-production.up.railway.app
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      /^(http:\/\/localhost:\d+|http:\/\/127\.0\.0\.1:\d+)$/, // Autorise localhost et 127.0.0.1
      "https://la-pince.up.railway.app", // Autorise ton domaine en production
      "http://localhost:3000", // Autorise Swagger UI en local
    ];

    if (!origin || allowedOrigins.some(pattern => typeof pattern === "string" ? pattern === origin : pattern.test(origin))) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));

// Add Swagger UI routes
app.use(swaggerRoutes);

app.use(router);

app.use(errorHandler);