import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { RefreshToken } from './entities/refresh-token.entity';
import { User } from '../user/entities/user.entity';

/**
 * The RefreshTokenService is a service that encapsulates the refresh token feature.
 * @class RefreshTokenService
 * @exports RefreshTokenService
 */
@Injectable()
export class RefreshTokenService {
    /**
     *
     * @param {Repository<RefreshToken>} refreshTokenRepository - The repository of the refresh token
     */
    constructor(
        @InjectRepository(RefreshToken)
        private refreshTokenRepository: Repository<RefreshToken>,
    ) {}

    /**
     * Creates a new refresh token for a user.
     * @param {User} user - The user.
     * @param {string} token - The encrypted refresh token.
     * @returns {Promise<RefreshToken>} - The new refresh token.
     */
    async createRefreshToken(user: User, token: string): Promise<RefreshToken> {
        try {
            const refreshToken = this.refreshTokenRepository.create({
                token,
                isActive: true,
                user,
            });

            return await this.refreshTokenRepository.save(refreshToken);
        } catch (error) {
            console.log(error.message);
            throw new Error('Could not create refresh token');
        }
    }

    /**
     * Removes a refresh token from the database.
     * @param {string} token - The refresh token to remove.
     */
    async removeRefreshToken(token: string): Promise<void> {
        await this.refreshTokenRepository.delete({ token });
    }

    /**
     * Removes all refresh tokens for a user.
     * @param {User} user - The user.
     */
    async removeAllRefreshTokensForUser(user: User): Promise<void> {
        await this.refreshTokenRepository.delete({ user });
    }

    /**
     * Checks if a refresh token is valid for a user.
     * @param {User} user - The user.
     * @param {string} token - The refresh token to check.
     * @returns {Promise<RefreshToken | null>} - Returns the token if valid, null otherwise.
     */
    async findRefreshTokenForUser(user: User, token: string): Promise<RefreshToken | null> {
        return await this.refreshTokenRepository.findOne({
            where: {
                user: {
                    id: user.id,
                },
                token,
                isActive: true,
            },
        });
    }
}
