const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Saloon API',
            version: '1.0.0',
            description: 'Authentication APIs for Users & Salons',
        },
        servers: [{ url: 'http://localhost:5000' }],
    },
    apis: ['./routes/*.js'],
};

const specs = swaggerJsDoc(options);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
