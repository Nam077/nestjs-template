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

    /**
     * @param {string} name - The name
     * @returns {string} - Hello {name}
     */
    getName(name: string): string {
        return `Hello ${name}`;
    }

    /**
     * @param {string} chui - The chui
     * @returns {string} - Chui hai zuka {chui}
     * @description Funtrion to chui hai zuka
     */
    chuiHaiZuka(chui: string): string {
        return `Chui hai zuka ${chui}`;
    }
}
