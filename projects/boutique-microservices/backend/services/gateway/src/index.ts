import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import { metricsMiddleware, setupMetrics } from './metrics';

dotenv.config();

const app = express();
const PORT: number = Number(process.env.GATEWAY_PORT) || 3001;

app.use(helmet());
app.use(cors());

setupMetrics(app, { serviceName: 'gateway', serviceVersion: '1.0.0' });

app.use(metricsMiddleware);

const services = {
  auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3002',
  products: process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3003',
  orders: process.env.ORDERS_SERVICE_URL || 'http://localhost:3004',
  users: process.env.USERS_SERVICE_URL || 'http://localhost:3005',
};

app.use('/api/auth', createProxyMiddleware({
  target: services.auth,
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '' },
}));

app.use('/api/products', createProxyMiddleware({
  target: services.products,
  changeOrigin: true,
  pathRewrite: { '^/api/products': '' },
}));

app.use('/api/orders', createProxyMiddleware({
  target: services.orders,
  changeOrigin: true,
  pathRewrite: { '^/api/orders': '' },
}));

app.use('/api/users', createProxyMiddleware({
  target: services.users,
  changeOrigin: true,
  pathRewrite: { '^/api/users': '' },
}));

app.use((req, res) => {
  res.status(404).json({ error: 'Service not found' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Proxying to services:`, services);
});