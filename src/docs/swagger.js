import swaggerJsdoc from "swagger-jsdoc";

/**
 * Swagger configuration options.
 */
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Documentation for the API",
    },
    servers: [
      {
        url: "http://localhost:3000", // URL pour le développement local
        description: "Local server",
      },
      {
        url: "https://la-pince-api.up.railway.app", // URL pour la production
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      parameters: {
        IdParam: {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "integer",
          },
          description: "The ID of the resource.",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            email: { type: "string", example: "user@example.com" },
            password: { type: "string", example: "Password123!" },
          },
        },
        Budget: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            amount: { type: "number", example: 500 },
            alert: { type: "number", example: 80 },
            category_id: { type: "integer", example: 2 },
            user_id: { type: "integer", example: 1 },
          },
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            name: { type: "string", example: "Groceries" },
          },
        },
        Expense: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            amount: { type: "number", example: 50.75 },
            description: { type: "string", example: "Dinner at a restaurant" },
            date: { type: "string", format: "date", example: "2023-10-01" },
            category_id: { type: "integer", example: 2 },
            user_id: { type: "integer", example: 1 },
          },
        },
      },
    },
  },
  apis: [
    "./src/controllers/*.js", // Include controller files
    "./src/middlewares/*.js", // Include middleware files
    "./src/router.js",        // Include the router file
  ],
};

// Generate Swagger specification
export const swaggerSpec = swaggerJsdoc(swaggerOptions);