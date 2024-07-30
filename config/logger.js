import { createLogger, format, transports } from 'winston';
import { addColors } from 'winston/lib/winston/config/index.js';

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
  }
};

const developmentLogger = () => {
  return createLogger({
    levels: customLevels.levels,
    format: combine(
      colorize({ all: true }),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      logFormat
    ),
    transports: [new transports.Console()],
  });
};

const productionLogger = () => {
  return createLogger({
    levels: customLevels.levels,
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      logFormat
    ),
    transports: [
      new transports.File({ filename: 'errors.log', level: 'error' }),
      new transports.Console(),
    ],
  });
};

const logger = process.env.NODE_ENV === 'production' ? productionLogger() : developmentLogger();

// Apply custom colors
addColors(customLevels.colors);

export default logger;
