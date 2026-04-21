require('dotenv').config();

module.exports = {
  development: {
    database: process.env.DB_NAME || 'blog_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'sifat',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5000,
  },
  production: {
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    ssl: {
      rejectUnauthorized: false,
    },
  },
};