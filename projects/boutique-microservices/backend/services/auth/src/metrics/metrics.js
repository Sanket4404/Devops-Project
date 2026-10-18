const promClient = require('prom-client');

const register = new promClient.Registry();

promClient.collectDefaultMetrics({ register });

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code', 'service_name'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register],
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code', 'service_name'],
  registers: [register],
});

const httpRequestsInProgress = new promClient.Gauge({
  name: 'http_requests_in_progress',
  help: 'Number of HTTP requests in progress',
  labelNames: ['method', 'route', 'service_name'],
  registers: [register],
});

const serviceInfo = new promClient.Gauge({
  name: 'service_info',
  help: 'Static information about service',
  labelNames: ['service_name', 'version'],
  registers: [register],
});

function metricsMiddleware(req, res, next) {
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

function setupMetrics(app, options) {
  const { serviceName, serviceVersion = '1.0.0' } = options;

  app.set('serviceName', serviceName);

  serviceInfo.set({ service_name: serviceName, version: serviceVersion }, 1);

  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });

  app.get('/health', (req, res) => {
    res.json({ status: `${serviceName} is healthy`, timestamp: new Date().toISOString() });
  });
}

module.exports = {
  register,
  metricsMiddleware,
  setupMetrics,
};
