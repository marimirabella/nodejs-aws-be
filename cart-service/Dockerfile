# Base
FROM node:12-slim AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /cart-service

# Dependencies
COPY package*.json yarn.lock ./
RUN yarn install && yarn cache clean
RUN yarn global add dockerlint

# Build
COPY . .
RUN dockerlint Dockerfile && yarn test:coverage && yarn test:e2e
RUN yarn build

FROM node:12-slim AS runtime
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

COPY --from=builder /cart-service/package*.json /cart-service/yarn.lock ./
RUN yarn install --production --frozen-lockfile && yarn cache clean
RUN yarn global add pm2
COPY --from=builder /cart-service/dist /dist

# Application
USER node
ENV PORT=8080
EXPOSE 8080

CMD ["pm2-runtime", "dist/main.js"]