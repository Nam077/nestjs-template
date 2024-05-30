import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtServiceGenerateToken } from './jwt.service';
import { UserModule } from '../user/user.module';

/**
 *
 */
@Module({
    imports: [UserModule, JwtModule.register({}), ConfigModule.forRoot()],
    controllers: [AuthController],
    providers: [AuthService, JwtServiceGenerateToken],
    exports: [AuthService],
})
export class AuthModule {}
