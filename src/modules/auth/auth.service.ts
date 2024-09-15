import { Injectable } from '@nestjs/common';

import { LoginDto } from './dtos/login.dto';
import { JwtPayload, JwtServiceGenerateToken, JwtToken } from './jwt.service';
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
     * @description Constructor of the AuthService
     */
    constructor(
        private readonly userService: UserService,
        private readonly jwtServiceGenerateToken: JwtServiceGenerateToken,
    ) {}

    /**
     * @description Login a user with the login data transfer object
     * @param {LoginDto} loginDto - The login data transfer object
     * @returns {Promise<LoginResponse>} - The login response
     */
    async login(loginDto: LoginDto): Promise<LoginResponse> {
        const user: User = await this.userService.login(loginDto);
        const token: JwtToken = await this.jwtServiceGenerateToken.generateToken(user);

        return {
            ...token,
            user,
        };
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
}
