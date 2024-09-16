import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { Strategy, VerifyCallback } from 'passport-google-oauth20';

/**
 * The google strategy
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    /**
     * Constructor
     * @param {ConfigService} configService - The config service
     */
    constructor(configService: ConfigService) {
        super({
            clientID: configService.get('GOOGLE_CLIENT_ID'), // Add your client ID
            clientSecret: configService.get('GOOGLE_CLIENT_SECRET'), // Add your client secret
            callbackURL: 'http://localhost:3000/auth/google/callback',
            scope: ['email', 'profile'],
        });
    }

    /**
     *
     * @param {string} accessToken - The access token
     * @param {string} refreshToken - The refresh token
     * @param {any} profile - The profile
     * @param {VerifyCallback} done - The callback
     */
    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { name, emails, photos } = profile;

        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken,
        };

        done(null, user);
    }
}
