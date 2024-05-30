import { Injectable } from '@nestjs/common';

import { LoginDto } from './dtos/login.dto';
import { JwtServiceGenerateToken, JwtToken } from './jwt.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
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
}
