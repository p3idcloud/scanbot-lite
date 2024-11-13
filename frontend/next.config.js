const nextConfig = {
  env: {
    LOGIN_SESSION_DAY: parseInt(process.env.LOGIN_SESSION_DAY),
    JWT_SECRET: process.env.JWT_SECRET,
    BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
    SAME_DOMAIN: process.env.SAME_DOMAIN,
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
        source: '/api/auth/signin',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/auth/signin`,
        permanent: true,
      },
      {
        source: '/signout',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}api/auth/signout`,
        permanent: true,
      },
    ];
  },
  output: 'standalone',
};

module.exports = nextConfig;
