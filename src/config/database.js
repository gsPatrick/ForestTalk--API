// Usado pelo app (via models/index.js) e pelo sequelize-cli (migrate).
const { DATABASE_URL, isProduction } = require('./env');

const base = {
  url: DATABASE_URL,
  dialect: 'postgres',
  logging: false,
  define: { underscored: true, timestamps: true },
  dialectOptions: isProduction ? { ssl: { require: true, rejectUnauthorized: false } } : {},
};

module.exports = { development: base, test: base, production: base };
