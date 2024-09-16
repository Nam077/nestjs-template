import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

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
export class AppModule {}
