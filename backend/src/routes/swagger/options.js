const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Scanbot Lite Api',
      version: '1.0.0',
      description: 'Scanner Api for scanner management'
    },
    security: [{ bearerAuth: [] }],
  },
  apis: [
    './src/models/*.js',
    './src/routes/*.js'
  ],
  tags: [
    {
      name: 'Scanners',
      description: 'API for scanners'
    },
    {
      name: 'Accounts',
      description: 'API for accounts'
    },
    {
      name: 'Jobs',
      description: 'API for Jobs'
    },
    {
      name: 'Scanner Setting',
      description: 'API to manage scanner setting'
    },
    {
      name: 'Scanner State',
      description: 'API to manage scanner state'
    },
    {
      name: 'Scanner History',
      description: 'API to manage scanner history'
    }
  ],
};

module.exports = swaggerOptions;