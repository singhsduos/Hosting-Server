const config = require('config');

const dbConfig = {
  activeDb: process.env.DB_TYPE || 'postgres',

  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/hosting-server',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },

  postgres: {
    user: process.env.POSTGRES_USER || 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'hosting_server',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    max: parseInt(process.env.POSTGRES_MAX_CONNECTIONS || '20', 10),
    idleTimeoutMillis: parseInt(process.env.POSTGRES_IDLE_TIMEOUT || '30000', 10),
  },
};

module.exports = dbConfig;
