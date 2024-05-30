import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService, LoginResponse } from './auth.service';
import { LoginDto } from './dtos/login.dto';

/**
 * The AuthController is the controller that handles the authentication routes.
 */
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    /**
     * Initializes the AuthController.
     * @param authService
     */
    constructor(private readonly authService: AuthService) {}

    /**
     *
     * @param {LoginDto} loginDto - The login data transfer object
     * @returns {Promise<LoginResponse>} - The access token
     */
    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
        return this.authService.login(loginDto);
    }
}
