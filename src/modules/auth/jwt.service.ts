import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { User } from '../user/entities/user.entity';

export interface JwtPayload {
    sub: string;
    email: string;
}

export interface JwtToken {
    accessToken: string;
    refreshToken: string;
}
/**
 * The JwtServiceGenerateToken class.
 */
@Injectable()
export class JwtServiceGenerateToken {
    /**
     * @description Constructor of the JwtServiceGenerateToken
     * @param {JwtService} jwtService - The jwt service instance
     * @param {ConfigService} configService - The config service instance
     */
    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    /**
     * @description Generate an access token with the payload
     * @param {User} payload - The payload of the user
     * @returns {Promise<string>} - The access token of the user
     */
    async generateAccessToken(payload: User): Promise<string> {
        return await this.jwtService.signAsync(
            { sub: payload.id, email: payload.email },
            {
                secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
                expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
            },
        );
    }

    /**
     * @description Generate a refresh token with the payload
     * @param {User} payload - The payload
     * @returns {Promise<string>} - The refresh token
     */
    async generateRefreshToken(payload: User): Promise<string> {
        return await this.jwtService.signAsync(
            { sub: payload.id, email: payload.email },
            {
                secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
                expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
            },
        );
    }

    /**
     *
     * @param {User} payload - The payload
     * @returns {Promise<JwtToken>} - The access token and refresh token
     */
    async generateToken(payload: User): Promise<JwtToken> {
        return {
            accessToken: await this.generateAccessToken(payload),
            refreshToken: await this.generateRefreshToken(payload),
        };
    }
}
