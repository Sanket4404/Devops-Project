import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
import { userRoutes } from './routes/users';
import { connectDB } from './database/connection';
import { metricsMiddleware, setupMetrics } from './metrics';

dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 3006;

app.use(helmet());
app.use(cors());
app.use(express.json());

setupMetrics(app, { serviceName: 'user-service', serviceVersion: '1.0.0' });

app.use(metricsMiddleware);

app.use('', userRoutes);

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`User service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start user service:', error);
    process.exit(1);
  }
};

startServer();
