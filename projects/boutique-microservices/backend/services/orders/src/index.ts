import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import { orderRoutes } from './routes/orders';
import { connectDB } from './database/connection';
import { metricsMiddleware, setupMetrics } from './metrics';

dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 3005;

app.use(helmet());
app.use(cors());
app.use(express.json());

setupMetrics(app, { serviceName: 'orders', serviceVersion: '1.0.0' });

app.use(metricsMiddleware);

app.use('', orderRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Orders service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start orders service:', error);
    process.exit(1);
  }
};

startServer();
