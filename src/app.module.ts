import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonModuleConfig } from './modules/winston/winston.module';

/**
 * App module is the root module of the application.
 */
@Module({
    imports: [WinstonModuleConfig],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
