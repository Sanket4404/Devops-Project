import { Counter, Histogram, Gauge, Registry, collectDefaultMetrics } from 'prom-client';

export const register = new Registry();

collectDefaultMetrics({ register });

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code', 'service_name'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});

export const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code', 'service_name'],
  registers: [register],
});

export const httpRequestsInProgress = new Gauge({
  name: 'http_requests_in_progress',
  help: 'Number of HTTP requests in progress',
  labelNames: ['method', 'route', 'service_name'],
  registers: [register],
});

export const serviceInfo = new Gauge({
  name: 'service_info',
  help: 'Static information about service',
  labelNames: ['service_name', 'version'],
  registers: [register],
});

export interface MetricsOptions {
  serviceName: string;
  serviceVersion?: string;
}

export function metricsMiddleware(req: any, res: any, next: any) {
  const start = Date.now();
  const route = req.route?.path || req.path || 'unknown';
  const serviceName = req.app.get('serviceName') || 'unknown';

  httpRequestsInProgress.inc({ method: req.method, route, service_name: serviceName }, 1);

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const statusCode = res.statusCode.toString();

    httpRequestDuration.observe(
      { method: req.method, route, status_code: statusCode, service_name: serviceName },
      duration
    );

    httpRequestTotal.inc(
      { method: req.method, route, status_code: statusCode, service_name: serviceName },
      1
    );

    httpRequestsInProgress.dec({ method: req.method, route, service_name: serviceName }, 1);
  });

  next();
}

export function setupMetrics(app: any, options: MetricsOptions) {
  const { serviceName, serviceVersion = '1.0.0' } = options;

  app.set('serviceName', serviceName);

  serviceInfo.set({ service_name: serviceName, version: serviceVersion }, 1);

  app.get('/metrics', async (req: any, res: any) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });

  app.get('/health', (req: any, res: any) => {
    res.json({ status: `${serviceName} is healthy`, timestamp: new Date().toISOString() });
  });
}
