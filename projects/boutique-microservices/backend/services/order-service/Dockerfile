# Order Service Dockerfile (JavaScript service)
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install --production && npm cache clean --force

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3004

CMD ["node", "src/server.js"]