import pino from 'pino';

const { NODE_ENV } = process.env;

const transportDev = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
  },
});

const logger = pino(
  {
    level: NODE_ENV === 'development' ? 'debug' : 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transportDev,
);

export { logger };
