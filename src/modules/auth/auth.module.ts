import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtServiceGenerateToken } from './jwt.service';
import { GithubStrategy } from './strategies/github.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { RefreshTokenStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { KeyModule } from '../key/key.module';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { UserModule } from '../user/user.module';

/**
 *
 */
@Module({
    imports: [UserModule, JwtModule.register({}), ConfigModule.forRoot(), KeyModule, RefreshTokenModule],
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtServiceGenerateToken,
        JwtStrategy,
        RefreshTokenStrategy,
        GoogleStrategy,
        GithubStrategy,
    ],
    exports: [AuthService],
})
export class AuthModule {}
