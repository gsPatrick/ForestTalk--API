// Usado pelo app (via models/index.js) e pelo sequelize-cli (migrate).
const { DATABASE_URL, DATABASE_SSL, isProduction } = require('./env');

const base = {
  url: DATABASE_URL,
  dialect: 'postgres',
  logging: false,
  define: { underscored: true, timestamps: true },
  dialectOptions: isProduction && DATABASE_SSL ? { ssl: { require: true, rejectUnauthorized: false } } : {},
};

module.exports = { development: base, test: base, production: base };
