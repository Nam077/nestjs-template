import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';

import { Request } from 'express';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

import { KeyService } from '../../key/key.service';
import { User } from '../../user/entities/user.entity';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../jwt.service';

/**
 *
 */
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    /**
     *
     * @param {AuthService} authService - The authentication service instance.
     * @param {KeyService} keyService - The service to retrieve keys based on kid.
     * @param {JwtService} jwtService - Service for decoding JWT tokens.
     */
    constructor(
        private authService: AuthService,
        private keyService: KeyService,
        private jwtService: JwtService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request.cookies['refreshToken']; // Lấy Refresh Token từ cookies
                },
            ]),
            secretOrKeyProvider: RefreshTokenStrategy.secretOrKeyProvider(keyService, jwtService),
            passReqToCallback: true, // Cho phép truy cập request trong validate method
        });
    }

    /**
     * Xác thực refresh token và trả về người dùng nếu token hợp lệ.
     * @param {Request} req - Yêu cầu HTTP.
     * @param {any} payload - Payload của JWT.
     * @returns {Promise<any>} - Người dùng đã được xác thực.
     */
    async validate(req: Request, payload: JwtPayload): Promise<User> {
        const refreshToken = req.cookies['refreshToken']; // Lấy refresh token từ cookies
        const userId = payload.sub; // Lấy userId từ payload

        const user = await this.authService.getUserIfRefreshTokenMatches(refreshToken, userId);

        if (!user) {
            throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
        }

        return user;
    }

    /**
     * Dynamically provides the secret key based on the kid in the JWT header.
     * @param {KeyService} keyService - Service for retrieving the secret key.
     * @param {JwtService} jwtService - Service for decoding JWT tokens.
     * @returns {(request: Request, rawJwtToken: string, done: VerifiedCallback) => Promise<void>} - A function to provide the secret key for Passport.
     */
    static secretOrKeyProvider(
        keyService: KeyService,
        jwtService: JwtService,
    ): (request: Request, rawJwtToken: string, done: VerifiedCallback) => Promise<void> {
        return async (request: Request, rawJwtToken: string, done: VerifiedCallback): Promise<void> => {
            try {
                const decodedToken = jwtService.decode(rawJwtToken, { complete: true }) as any;
                const kid: string = decodedToken?.header?.kid; // Extract the kid from the header

                if (!kid) {
                    return done(new UnauthorizedException('Missing kid in token header'), null);
                }

                const secretKey = await keyService.getSecretKeyById(kid);

                return done(null, secretKey);
            } catch (error) {
                return done(error, null);
            }
        };
    }
}
