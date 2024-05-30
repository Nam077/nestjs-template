import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

import { ConnectionName } from '../../../common';
import { User } from '../../user/entities/user.entity';

/**
 *
 */
@Injectable()
export class MainConfigService implements TypeOrmOptionsFactory {
    /**
     *
     * @param {ConfigService} configService - The config service
     */
    constructor(private readonly configService: ConfigService) {}

    /**
     * @param {ConnectionName} connectionName  - The connection name
     * @returns {TypeOrmModuleOptions} - The type orm options or a promise of type orm options
     */
    createTypeOrmOptions(connectionName?: ConnectionName): TypeOrmModuleOptions {
        if (connectionName === ConnectionName.LOGGING) {
            return {
                type: 'mysql',
                host: this.configService.get<string>('DATABASE_HOST'),
                port: this.configService.get<number>('DATABASE_PORT'),
                username: this.configService.get<string>('DATABASE_USERNAME'),
                password: this.configService.get<string>('DATABASE_PASSWORD'),
                database: this.configService.get<string>('DATABASE_NAME'),
                entities: [User],
                synchronize: true,
                logging: true,
            };
        }

        return {
            type: 'mysql',
            host: this.configService.get<string>('DATABASE_HOST'),
            port: this.configService.get<number>('DATABASE_PORT'),
            username: this.configService.get<string>('DATABASE_USERNAME'),
            password: this.configService.get<string>('DATABASE_PASSWORD'),
            database: this.configService.get<string>('DATABASE_NAME'),
            entities: [User],
            synchronize: true,
            autoLoadEntities: true,
        };
    }
}
