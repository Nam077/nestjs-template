import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

/**
 * The app controller.
 */
@Controller()
export class AppController {
    /**
     * @param {AppService} appService - The app service instance.
     * @class AppController
     */
    constructor(private readonly appService: AppService) {}

    /**
     * @description Get the hello message.
     * @returns {string} Hello World!
     */
    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    /**
     * @returns {string} API
     */
    @Get('api')
    getApi(): string {
        return 'API';
    }
}
