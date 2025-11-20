const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Simple Notes API',
      version: '1.0.0',
      description: 'REST API for managing notes (CRUD) with simple file persistence.',
    },
    servers: [
      // Final server URL set dynamically in app.js to include the correct host/port
      { url: '/' },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
