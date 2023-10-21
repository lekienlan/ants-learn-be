import { createLogger, format, transports } from 'winston';
// Import Functions
const { Console } = transports;
// Init Logger
const logger = createLogger({
  level: 'info'
});

const errorStackFormat = format((info) => {
  if (info.stack) {
    // tslint:disable-next-line:no-console
    return false;
  }
  return info;
});
const consoleTransport = new Console({
  format: format.combine(
    format.colorize(),
    format.simple(),
    errorStackFormat(),
    format.timestamp({ format: 'HH:mm:ss' }),
    format.printf((info) => {
      return `${info.timestamp} ${info.level}: ${info.message}`;
    })
  )
});
logger.add(consoleTransport);

export default logger;
