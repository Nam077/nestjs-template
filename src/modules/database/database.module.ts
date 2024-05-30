import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MainConfigService } from './service/main-config.service';
import { ConnectionName } from '../../common';

/**
 * The module connect to the database.
 */
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            name: ConnectionName.DEFAULT,
            useClass: MainConfigService,
        }),
        ConfigModule.forRoot({}),
    ],
})
export class DatabaseModule {}
