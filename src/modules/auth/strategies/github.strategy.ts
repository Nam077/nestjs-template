import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import axios from 'axios';
import { Profile, Strategy } from 'passport-github';

/**
 *
 */
@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
    /**
     *
     * @param {ConfigService} configService - The config service
     */
    constructor(private readonly configService: ConfigService) {
        super({
            clientID: configService.get<string>('GITHUB_CLIENT_ID'), // Add your client ID
            clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET'), // Add your client secret
            callbackURL: 'http://localhost:3000/auth/github/callback', // Cấu hình URL callback
            scope: ['user:email', 'user:follow', 'read:user'], // Cấu hình scope
        });
    }

    /**
     *
     * @param {string} accessToken - The access token
     * @param {string} refreshToken - The refresh token
     * @param {Profile} profile - The profile
     * @param {any} done - The callback
     */
    async validate(accessToken: string, refreshToken: string, profile: Profile, done: any): Promise<any> {
        const { id, username, displayName, photos, profileUrl, _json } = profile;

        console.log(profile);

        console.log(await this.getGithubEmail(accessToken));

        // Lấy các thông tin quan trọng từ GitHub
        const user = {
            githubId: id,
            username: username || displayName,
            avatar: photos && photos.length ? photos[0].value : null,
            profileUrl: profileUrl,
            email: (_json as { email?: string })?.email || 'No email provided',
            company: (_json as { company?: string })?.company || 'No company provided',
            location: (_json as { location?: string })?.location || 'No location provided',
            bio: (_json as { bio?: string })?.bio || 'No bio provided',
            publicRepos: (_json as { public_repos?: number })?.public_repos || 0,
            followers: (_json as { followers?: number })?.followers || 0,
            following: (_json as { following?: number })?.following || 0,
            createdAt: (_json as { created_at?: string })?.created_at,
            updatedAt: (_json as { updated_at?: string })?.updated_at,
        };

        // Thực hiện xử lý dữ liệu người dùng ở đây (ví dụ lưu vào database)

        done(null, user); // Trả về dữ liệu người dùng
    }

    // Lấy email qua API GitHub
    /**
     *
     * @param {string} accessToken - The access token
     * @returns {Promise<string>} - The email
     */
    async getGithubEmail(accessToken: string) {
        const response = await axios.get('https://api.github.com/user/emails', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const primaryEmail = response.data.find((email: any) => email.primary && email.verified);

        return primaryEmail ? primaryEmail.email : null;
    }
}
