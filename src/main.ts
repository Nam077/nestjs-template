import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

import { AppModule } from './app.module';
import { setUpSwagger } from './common';

/**
 * The function to bootstrap the application.
 */
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    app.use(cookieParser());
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );
    app.useGlobalPipes(new I18nValidationPipe());
    app.useGlobalFilters(new I18nValidationExceptionFilter());
    app.use(compression());

    setUpSwagger(app);

    await app.listen(3000);
}

bootstrap();
