FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci
COPY . .
RUN npm run verify

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json .npmrc ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
COPY src/server ./src/server
COPY src/shared ./src/shared
COPY drizzle ./drizzle
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=3s --start-period=10s CMD wget -qO- http://localhost:3000/api/health || exit 1
CMD ["node", "src/server/index.ts"]
