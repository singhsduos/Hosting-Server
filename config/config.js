const config = {
  development: {
    port: process.env.PORT || 3000,
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
    jsonSecret: process.env.JSON_SECRET,
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
    jsonSecret: process.env.JSON_SECRET,
  },
};

module.exports = config[process.env.NODE_ENV || 'development'];
