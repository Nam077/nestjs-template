import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MainConfigService } from './service/main-config.service';

/**
 * The module connect to the database.
 */
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useClass: MainConfigService,
        }),
        ConfigModule.forRoot({}),
    ],
    providers: [MainConfigService],
})
export class DatabaseModule {}
