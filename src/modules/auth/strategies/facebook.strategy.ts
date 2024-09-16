import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import axios from 'axios';
import { Strategy, Profile } from 'passport-facebook';

/**
 *
 */
@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
    /**
     *
     * @param {ConfigService} configService - The config service
     */
    constructor(private readonly configService: ConfigService) {
        super({
            clientID: configService.get<string>('FACEBOOK_APP_ID'), // Lấy giá trị từ ConfigService
            clientSecret: configService.get<string>('FACEBOOK_APP_SECRET'), // Lấy giá trị từ ConfigService
            callbackURL: 'http://localhost:3000/auth/facebook/callback',
            profileFields: ['id', 'displayName', 'emails', 'photos', 'birthday'],
        });
    }

    /**
     *
     * @param {string} accessToken - The access token
     * @param {string} refreshToken - The refresh token
     * @param {Profile} profile - The profile
     * @param {any} done - The callback
     * @returns {Promise<any>} The result
     */
    async validate(
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (error: any, user?: any, info?: any) => void,
    ): Promise<any> {
        const { id, displayName, emails, photos, birthday } = profile;

        console.log(await this.getFacebookEmail(accessToken));

        const user = {
            facebookId: id,
            displayName: displayName || 'No display name',
            email: emails && emails.length > 0 ? emails[0].value : 'No email provided',
            picture: photos && photos.length > 0 ? photos[0].value : null,
            birthday: birthday || 'No birthday provided',
            accessToken,
        };

        done(null, user);
    }

    // Gọi Facebook Graph API để lấy email người dùng
    /**
     *
     * @param {string} accessToken - The access token
     * @returns {Promise<string | null>} The result
     */
    async getFacebookEmail(accessToken: string): Promise<string | null> {
        try {
            const response = await axios.get(`https://graph.facebook.com/me?fields=email&access_token=${accessToken}`);

            return response.data.email || null;
        } catch (error) {
            console.error('Error fetching email from Facebook:', error);

            return null;
        }
    }
}
