import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsEmail } from 'class-validator';

/**
 * The LoginDto class is used to validate and transfer data
 * for user login.
 */
export class LoginDto {
    @ApiProperty({
        description: 'The email of the user',
        example: 'john.doe@example.com',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'The password of the user',
        example: 'StrongP@ssw0rd',
    })
    @IsString()
    password: string;
}
