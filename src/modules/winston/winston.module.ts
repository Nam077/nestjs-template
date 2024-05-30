/**
 * This module provides a wrapper around the Winston logger library.
 * It allows for easy configuration and usage of the logger in a NestJS application.
 */

import { Module } from '@nestjs/common';

import 'winston-daily-rotate-file';
import {
    WinstonModule,
    WinstonModuleOptions,
    WinstonModuleOptionsFactory,
    utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import { DailyRotateFile } from 'winston/lib/winston/transports';

import { formatLog } from '../../common';

export const loggerOptions = {
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.ms(),
                nestWinstonModuleUtilities.format.nestLike('MyApp', {
                    colors: true,
                    prettyPrint: true,
                    processId: true,
                }),
            ),
        }),
        new DailyRotateFile({
            filename: '%DATE%',
            datePattern: 'DD-MM-YYYY',
            zippedArchive: true,
            extension: '.log',
            maxSize: '20m',
            maxFiles: '14d',
            dirname: 'logs',
            auditFile: 'logs/audit.json',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.printf(formatLog),
                winston.format((info) => {
                    if (info.context) {
                        return false; // Bỏ qua log của NestJS có thuộc tính context
                    }

                    return info;
                })(),
            ),
        }),
    ],
};

/**
 * The Winston module configuration.
 */
class WinstonConfig implements WinstonModuleOptionsFactory {
    /**
     * Creates the Winston module options.
     * @returns {WinstonModuleOptions | Promise<WinstonModuleOptions>} The Winston module options.
     */
    createWinstonModuleOptions(): WinstonModuleOptions {
        return loggerOptions;
    }
}

/**
 * The Winston module that provides a wrapper around the Winston logger library.
 */
@Module({
    imports: [
        WinstonModule.forRootAsync({
            useClass: WinstonConfig,
        }),
    ],
})
export class WinstonModuleConfig {}
