import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsString, Length, IsNotEmpty } from 'class-validator';

import { Match } from '../../../common';
/**
 * Data transfer object for user registration
 */
export class RegisterDto {
    /**
     * The email of the user
     */
    @ApiProperty({ description: 'The email of the user', example: 'test@test.com' })
    @IsEmail({}, { message: 'Invalid email' })
    @IsNotEmpty({ message: 'Email cannot be empty' })
    email: string;

    /**
     * The password of the user
     */
    @ApiProperty({ description: 'The password of the user', example: 'StrongP@ssw0rd' })
    @IsString({ message: 'Invalid password' })
    @Length(8, 20, { message: 'Password must be between 8 and 20 characters' })
    @IsNotEmpty({ message: 'Password cannot be empty' })
    password: string;

    /**
     * The name of the user
     */
    @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
    @IsString({ message: 'Invalid name' })
    @Length(2, 50, { message: 'Name must be between 2 and 50 characters' })
    @IsNotEmpty({ message: 'Name cannot be empty' })
    name: string;

    /**
     * The confirm password of the user
     */
    @ApiProperty({ description: 'The confirm password of the user', example: 'StrongP@ssw0rd' })
    @IsString({ message: 'Invalid confirm password' })
    @Length(8, 20, { message: 'Confirm password must be between 8 and 20 characters' })
    @IsNotEmpty({ message: 'Confirm password cannot be empty' })
    @Match('password', { message: 'Passwords do not match' })
    confirmPassword: string;
}
