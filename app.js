const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const env = require('./src/config/env');
const routes = require('./src/routes');
const { globalLimiter } = require('./src/middlewares/rate-limit');
const { notFound, errorHandler } = require('./src/middlewares/error-handler');

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGINS === '*' ? true : env.CORS_ORIGINS.split(',') }));
app.use(compression());
app.use(express.json({ limit: '100kb' }));
app.use(globalLimiter);

app.use(env.API_PREFIX, routes);
app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  app.listen(env.PORT, () => console.log(`Forest Talk API em http://localhost:${env.PORT}${env.API_PREFIX}`));
}

module.exports = app;
