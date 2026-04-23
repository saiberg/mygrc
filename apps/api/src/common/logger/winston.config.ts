import { format, transports } from 'winston';
import * as path from 'path';

const logDir = 'logs';

export const winstonConfig = {
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.colorize(),
        format.printf(({ timestamp, level, message, context, trace }) => {
          return `${timestamp} [${level}]${context ? ' [' + context + ']' : ''} ${message}${trace ? '\n' + trace : ''}`;
        }),
      ),
    }),
    new transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
      format: format.combine(
        format.timestamp(),
        format.json(),
      ),
    }),
    new transports.File({
      filename: path.join(logDir, 'combined.log'),
      format: format.combine(
        format.timestamp(),
        format.json(),
      ),
    }),
  ],
};
