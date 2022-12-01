const nextConfig = {
  basePath: '',
  env: {
    LOGIN_SESSION_DAY: parseInt(process.env.LOGIN_SESSION_DAY),
    JWT_SECRET: process.env.JWT_SECRET,
    baseUrl: process.env.BASE_URL,
    backendUrl: process.env.BACKEND_URL,
    APP_SECRET_STRING: process.env.APP_SECRET_STRING,
  },
  webpack: (config, { isServer }) => {
    config.resolve.modules.push(require('path').resolve('./'));

    if (!isServer) {
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();

        if (
          entries['main.js'] &&
          !entries['main.js'].includes('./src/lib/ivalt.js')
        ) {
          entries['main.js'].unshift('./src/lib/ivalt.js');
        }

        return entries;
      };
    }

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
      },
    ];
  },
};

module.exports = nextConfig;
