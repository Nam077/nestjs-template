import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RefreshToken } from './entities/refresh-token.entity';
import { RefreshTokenService } from './refresh-token.service';

/**
 * The RefreshTokenModule is a module that encapsulates the refresh token feature.
 * @class RefreshTokenModule
 * @exports RefreshTokenModule
 */
@Module({
    imports: [TypeOrmModule.forFeature([RefreshToken])],
    providers: [RefreshTokenService],
    exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
