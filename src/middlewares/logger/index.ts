import path from 'path';
import winston, { format, transports } from 'winston';

const logFormat = format.printf(
  (info) => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
);

const filePath = `${path.dirname(__filename)}/${path.basename(__filename)}`;

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.label({
      label: filePath.match(/\/src\/(.*)/)?.[1]
    }),
    format.timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
    // Format the metadata object
    format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] })
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), logFormat)
    }),
    new transports.File({
      filename: 'logs/combined.log',
      format: format.combine(
        // Render in one line in your log file.
        // If you use prettyPrint() here it will be really
        // difficult to exploit your logs files afterwards.
        format.json()
      )
    })
  ],
  exitOnError: false
});

export default logger;
