import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy, ExtractJwt, VerifiedCallback } from 'passport-jwt';

import { KeyService } from '../../key/key.service';
import { User } from '../../user/entities/user.entity';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../jwt.service';

/**
 * JwtStrategy is responsible for handling JWT authentication with kid.
 * It uses the Passport JWT Strategy and dynamically retrieves the secret key based on the kid in the JWT header.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    /**
     * Constructor of JwtStrategy.
     * @param {KeyService} keyService - The service to retrieve keys based on kid.
     * @param {JwtService} jwtService - Service for decoding JWT tokens.
     * @param {AuthService} authService - The authentication service instance.
     */
    constructor(
        private keyService: KeyService,
        private jwtService: JwtService,
        private readonly authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
            secretOrKeyProvider: JwtStrategy.secretOrKeyProvider(keyService, jwtService), // Dynamically provide secret key based on kid
            ignoreExpiration: false, // Ensure token expiration is checked
        });
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

    /**
     * Validates the payload of the JWT after successful token verification.
     * @param {JwtPayload} payload - The decoded JWT payload.
     * @returns {Promise<User>} - The user entity.
     * @throws {UnauthorizedException} - Unauthorized exception if the user is not found.
     */
    async validate(payload: JwtPayload): Promise<User> {
        const user = this.authService.validateUser(payload);

        if (!user) {
            throw new UnauthorizedException('Unauthorized');
        }

        return user;
    }
}
