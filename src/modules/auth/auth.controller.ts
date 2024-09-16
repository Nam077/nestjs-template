import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import { AuthService, LoginResponse } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { RefreshTokenGuard } from './guard/jwt-refresh.guard';
import { CurrentUser } from '../../common';
import { User } from '../user/entities/user.entity';
/**
 * The AuthController is the controller that handles the authentication routes.
 * @class AuthController
 */
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    /**
     * Initializes the AuthController.
     * @param {AuthService} authService - The authentication service
     */
    constructor(private readonly authService: AuthService) {}

    /**
     *
     * @param {LoginDto} loginDto - The login data transfer object
     * @param {Response} response - The response object
     * @returns {Promise<LoginResponse>} - The login response
     */
    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response): Promise<LoginResponse> {
        const data = await this.authService.login(loginDto);

        response.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        delete data.refreshToken;

        return data;
    }

    /**
     * Route này sử dụng Refresh Token để làm mới Access Token.
     * @param {User} user - Người dùng hiện tại.
     * @returns {Promise<LoginResponse>} - The login response
     */
    @UseGuards(RefreshTokenGuard) // Bảo vệ route bằng RefreshTokenGuard
    @Post('refresh-token')
    async refreshAccessToken(@CurrentUser() user: User) {
        return this.authService.refreshAccessToken(user);
    }

    /**
     * @description Register a user with the register data transfer object
     * @param {RegisterDto} registerDto - The register data transfer object
     * @param {Response} response - The response object
     * @returns {Promise<LoginResponse>} - The login response
     */
    @Post('register')
    async register(
        @Body() registerDto: RegisterDto,
        @Res({ passthrough: true }) response: Response,
    ): Promise<LoginResponse> {
        const data = await this.authService.register(registerDto);

        response.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        delete data.refreshToken;

        return data;
    }
}
