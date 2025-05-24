import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

const router = Router();

/**
 * Swagger UI route.
 * Serves the Swagger documentation at `/api-docs`.
 */
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;