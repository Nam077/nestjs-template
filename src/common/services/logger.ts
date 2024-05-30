import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const loggerOptions = {
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `${timestamp} [${level}] ${message}`;
                }),
            ),
        }),
        new winston.transports.File({
            filename: 'application.log',
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),
    ],
};

export const WinstonLogger = WinstonModule.createLogger(loggerOptions);
