# Stage 1: build do frontend
FROM node:20-alpine AS frontend
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
ENV VITE_API_URL=""
RUN npm run build

# Stage 2: backend + frontend embutido
FROM node:20-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/prisma ./prisma
RUN npx prisma generate
COPY backend/ ./
COPY --from=frontend /frontend/dist ./public
EXPOSE 3333
CMD ["node", "app.js"]
