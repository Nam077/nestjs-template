import { Inject, Injectable } from '@nestjs/common';

import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

/**
 * The app service
 */
@Injectable()
export class AppService {
    /**
     *
     * @param {Logger} logger - The logger
     */
    constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}
    /**
     * @returns {string} - Hello World!
     */
    getHello(): string {
        this.logger.warn('Hello World!');

        return 'Hello World!';
    }
}
