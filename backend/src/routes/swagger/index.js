const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./options');
const express = require('express');
const router = express.Router();

const swaggerDocs = swaggerJSDoc(swaggerOptions);

var options = {
  explorer: true,
  swaggerOptions: {
    validatorUrl: null,
    url: '/api/swagger/swagger.json'
  },
};

router.get('/swagger.json', (req, res) => {
  res.setHeader('content-type', 'application/json');
  res.send(swaggerDocs);
});

router.use('/', swaggerUi.serve, swaggerUi.setup(null,options))

module.exports = router;