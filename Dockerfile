FROM node:22-alpine

ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

# Roda sem root
RUN chown -R node:node /app
USER node

ENV PORT=3333
EXPOSE 3333

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -qO- "http://127.0.0.1:${PORT}${API_PREFIX:-/api}/health" || exit 1

# Cria/atualiza as tabelas e inicia a API
CMD ["npm", "run", "start:prod"]
