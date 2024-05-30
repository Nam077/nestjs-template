import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsEmail, IsEnum, Length } from 'class-validator';

import { UserRole } from '../../../common';

/**
 * @class CreateUserDto
 * The CreateUserDto class is used to validate and transfer data
 * for creating a new user.
 */
export class CreateUserDto {
    @ApiProperty({
        description: 'The name of the user',
        maxLength: 100,
        example: 'John Doe',
    })
    @IsString()
    @Length(1, 100)
    name: string;

    @ApiProperty({
        description: 'The email of the user',
        maxLength: 100,
        example: 'john.doe@example.com',
    })
    @IsEmail()
    @Length(1, 100)
    email: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'StrongP@ssw0rd',
    })
    @IsString()
    password: string;

    @ApiProperty({
        description: 'The role of the user',
        enum: UserRole,
        default: UserRole.USER,
        example: UserRole.USER,
    })
    @IsEnum(UserRole)
    role: UserRole;
}
