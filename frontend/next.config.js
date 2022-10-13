const withPlugins = require("next-compose-plugins");
const path = require("path");

module.exports = withPlugins([], {
  basePath: '',
  env: {
    LOGIN_SESSION_DAY: parseInt(process.env.LOGIN_SESSION_DAY),
    JWT_SECRET: process.env.JWT_SECRET,
    baseUrl: process.env.BASE_URL,
    backendUrl: process.env.BACKEND_URL,
    APP_SECRET_STRING: process.env.APP_SECRET_STRING,
  },
  webpack(config, options) {
    config.resolve.modules.push(path.resolve("./"));
    return config;
  },
  async redirects() {
    return [
      {
        source: '/signin',
        destination: '/api/auth/login/saml',
        permanent: true,
      },
      {
        source: '/signout',
        destination: `${process.env.BACKEND_URL}api/auth/signout`,
        permanent: true,
      }
    ]
  },
});