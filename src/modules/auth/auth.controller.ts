import { Controller, Post, Body, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import { AuthService, LoginResponse } from './auth.service';
import { LoginDto } from './dtos/login.dto';
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
     * @param {Response} res - The response object
     * @returns {Promise<LoginResponse>} - The login response
     */
    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        const data = await this.authService.login(loginDto);

        res.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });
        delete data.refreshToken;

        return res.json(data);
    }
}
