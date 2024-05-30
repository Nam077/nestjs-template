import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { UserModule } from './modules/user/user.module';
import { WinstonModuleConfig } from './modules/winston/winston.module';
import { AuthModule } from './modules/auth/auth.module';

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
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
