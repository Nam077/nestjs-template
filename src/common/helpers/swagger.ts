import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * @param {INestApplication} app - The nest application instance
 * @description Set the URL for the swagger documentation
 */
export const setUpSwagger = (app: INestApplication): void => {
    const options = new DocumentBuilder()
        .setTitle('The Template API')
        .setDescription('This is project make to be a template for a new project')
        .setVersion('1.0')
        .addTag('nestjs')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('api', app, document);
};
