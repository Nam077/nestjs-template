/* eslint-disable jsdoc/require-param-type */
/* eslint-disable jsdoc/require-param-description */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { JwtPayload, JwtServiceGenerateToken, JwtToken } from './jwt.service';
import { KeyService } from '../key/key.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

export interface LoginResponse {
    accessToken: string;
    user: User;
    refreshToken: string;
}
/**
 *
 */
@Injectable()
export class AuthService {
    /**
     * @param {UserService} userService - The user service instance
     * @param {JwtServiceGenerateToken} jwtServiceGenerateToken - The jwt service instance
     * @param {KeyService} keyService - The key service instance
     * @param {JwtService} jwtService - The jwt service instance
     * @param {RefreshTokenService} refreshTokenService - The refresh token service instance
     * @description Constructor of the AuthService
     */
    constructor(
        private readonly userService: UserService,
        private readonly jwtServiceGenerateToken: JwtServiceGenerateToken,
        private readonly keyService: KeyService,
        private readonly jwtService: JwtService,
        private readonly refreshTokenService: RefreshTokenService,
    ) {}

    /**
     * @description Login a user with the login data transfer object
     * @param {LoginDto} loginDto - The login data transfer object
     * @returns {Promise<LoginResponse>} - The login response
     */
    async login(loginDto: LoginDto): Promise<LoginResponse> {
        try {
            const user: User = await this.userService.login(loginDto);
            const token: JwtToken = await this.jwtServiceGenerateToken.generateToken(user);

            await this.refreshTokenService.createRefreshToken(user, token.refreshToken);

            return {
                ...token,
                user,
            };
        } catch (error) {
            console.log(error.message);
            throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
        }
    }

    /**
     * @description Validate a user with the payload
     * @param {JwtPayload} payload - The payload of the JWT token
     * @returns {Promise<User>} - The user that is validated
     */
    async validateUser(payload: JwtPayload): Promise<User> {
        return await this.userService.findEntityById(payload.sub, {
            select: {
                id: true,
                email: true,
                role: true,
                name: true,
            },
        });
    }

    /**
     * Kiểm tra tính hợp lệ của Refresh Token và xác thực dựa trên userId và tokenId.
     * @param {string} refreshToken - Refresh Token từ cookies.
     * @param {string} userId - ID người dùng từ payload của JWT.
     * @returns {Promise<any>} - Trả về người dùng nếu token hợp lệ.
     */
    async getUserIfRefreshTokenMatches(refreshToken: string, userId: string): Promise<any> {
        const user = await this.userService.findEntityById(userId);

        if (!user) {
            throw new UnauthorizedException('Người dùng không tồn tại');
        }

        const validToken = await this.refreshTokenService.findRefreshTokenForUser(user, refreshToken);

        if (!validToken) {
            throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
        }

        try {
            // Lấy kid từ header của token
            const decodedToken = this.jwtService.decode(refreshToken, { complete: true }) as any;
            const kid = decodedToken?.header?.kid;

            if (!kid) {
                throw new UnauthorizedException('Kid không tồn tại trong token header');
            }

            // Lấy khóa bí mật từ KeyService dựa trên kid
            const secret = await this.keyService.getSecretKeyById(kid);

            // Xác thực Refresh Token bằng khóa bí mật tương ứng với kid
            this.jwtService.verify(refreshToken, {
                secret,
            });

            return user;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                // Nếu token hết hạn, xóa token khỏi cơ sở dữ liệu
                await this.refreshTokenService.removeRefreshToken(refreshToken);
                throw new UnauthorizedException('Refresh token đã hết hạn và bị xóa');
            } else {
                // Nếu token không hợp lệ (lỗi khác)
                throw new UnauthorizedException('Refresh token không hợp lệ');
            }
        }
    }

    /**
     *
     * @param {User} user - The user
     * @returns {Promise<{ accessToken: string }>} - The access token
     */
    async refreshAccessToken(user: User): Promise<{ accessToken: string }> {
        return {
            accessToken: await this.jwtServiceGenerateToken.generateAccessToken(user),
        };
    }

    /**
     * @description Register a user with the register data transfer object
     * @param {RegisterDto} registerDto - The register data transfer object
     * @returns {Promise<any>} - The register response
     */
    async register(registerDto: RegisterDto): Promise<any> {
        const user: User = await this.userService.register(registerDto);

        delete user.password;
        delete user.createdAt;
        delete user.updatedAt;

        const token: JwtToken = await this.jwtServiceGenerateToken.generateToken(user);

        await this.refreshTokenService.createRefreshToken(user, token.refreshToken);

        return {
            message: 'Register successfully',
            user,
            ...token,
        };
    }
}
