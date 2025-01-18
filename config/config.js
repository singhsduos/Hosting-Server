const config = {
  development: {
    port: process.env.PORT || 3000,
    database: {
      mongodb: {
        url: process.env.MONGODB_URI || 'mongodb://localhost:3000/hosting-server',
      },
      postgres: {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
        database: process.env.POSTGRES_DB || 'hosting_server',
        user: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
      },
    },
    apiUrl: process.env.API_URL || 'http://localhost:3000',
    frontBaseUrl: process.env.FRONT_BASE_URL || 'http://localhost:3000',
    sessionSecret: process.env.SESSION_SECRET || 'your-super-secret-session-key',
  },
  production: {
    port: process.env.PORT,
    database: {
      mongodb: {
        url: process.env.MONGODB_URI,
      },
      postgres: {
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT, 10),
        database: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
      },
    },
    apiUrl: process.env.API_URL,
    frontBaseUrl: process.env.FRONT_BASE_URL,
    sessionSecret: process.env.SESSION_SECRET,
  },
};

module.exports = config[process.env.NODE_ENV || 'development'];
