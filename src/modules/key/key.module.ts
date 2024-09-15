import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Key } from './entities/key.entity';
import { KeyRotationService } from './key-rotation.service';
import { KeyService } from './key.service';

/**
 * Key module is responsible for handling key related operations.
 */
@Module({
    imports: [TypeOrmModule.forFeature([Key]), ConfigModule.forRoot()],
    providers: [KeyService, KeyRotationService],
    exports: [KeyService],
})
export class KeyModule {}
