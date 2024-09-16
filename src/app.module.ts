import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { I18nMiddleware } from 'nestjs-i18n';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { I18nModuleConfig } from './modules/i18n/i18n.module';
import { KeyModule } from './modules/key/key.module';
import { RefreshTokenModule } from './modules/refresh-token/refresh-token.module';
import { UserModule } from './modules/user/user.module';
import { WinstonModuleConfig } from './modules/winston/winston.module';

/**
 * App module is the root module of the application.
 */
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env.${process.env.NODE_ENV}.local`,
            isGlobal: true,
        }),
        WinstonModuleConfig,
        DatabaseModule,
        UserModule,
        AuthModule,
        KeyModule,
        ScheduleModule.forRoot(),
        RefreshTokenModule,
        I18nModuleConfig,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    /**
     *
     * @param {MiddlewareConsumer} consumer - The middleware consumer
     */
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(I18nMiddleware).forRoutes('*');
    }
}
