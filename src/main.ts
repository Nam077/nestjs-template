import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { AppModule } from './app.module';

/**
 * The function to bootstrap the application.
 */
async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

    // swagger setup
    const options = new DocumentBuilder()
        .setTitle('The Template API')
        .setDescription('This is project make to be a template for a new project')
        .setVersion('1.0')
        .addTag('nestjs')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
}

bootstrap();
