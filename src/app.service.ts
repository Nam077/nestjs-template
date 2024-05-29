import { Injectable } from '@nestjs/common';

/**
 * The app service.
 */
@Injectable()
export class AppService {
    /**
     * @returns {string} - Hello World!
     */
    getHello(): string {
        return 'Hello World!';
    }

    /**
     * @returns {string} - ok
     */
    getOk(): string {
        return 'ok';
    }
}
