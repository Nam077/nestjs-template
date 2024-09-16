import { Controller, Get } from '@nestjs/common';

import { I18n, I18nContext } from 'nestjs-i18n';

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
     * @param {I18nContext} i18n - The i18n context.
     * @description Get the hello message.
     * @returns {string} The hello message.
     */
    @Get()
    getHello(@I18n() i18n: I18nContext): string {
        return i18n.t('test.HELLO');
    }

    /**
     * @returns {string} API
     */
    @Get('api')
    getApi(): string {
        return 'API';
    }
}
