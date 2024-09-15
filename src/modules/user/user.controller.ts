import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUserDto } from './dto/find-all.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { CurrentUser, ResponseData } from '../../common';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';

/**
 * The user controller
 */
@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UserController {
    /**
     *
     * @param {UserService} userService - The user service
     * @class
     */
    constructor(private readonly userService: UserService) {}

    /**
     *
     * @param {User} user - The user authenticated
     * @param {CreateUserDto} createUserDto - The create user dto
     * @returns {Promise<ResponseData<User>>} - This action creates a new user
     */
    @Post()
    create(@CurrentUser<User>() user, @Body() createUserDto: CreateUserDto): Promise<ResponseData<User>> {
        return this.userService.create(createUserDto, user);
    }

    /**
     * @param {User} user - The user authenticated
     * @param {FindAllUserDto} findAllUserDto - The find all user dto
     * @returns {User[]} - This action returns all user'
     */
    @Get()
    findAll(@CurrentUser<User>() user, @Query() findAllUserDto: FindAllUserDto) {
        return this.userService.findAll(findAllUserDto, user);
    }

    /**
     *
     * @param {User} user - The user authenticated
     * @param {string} id - The id
     * @returns {Promise<ResponseData<User>>} - This action returns a #${id} user
     */
    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(@CurrentUser<User>() user, @Param('id') id: string): Promise<ResponseData<User>> {
        return this.userService.findOne(id, user);
    }

    /**
     *
     * @param {User} user - The user authenticated
     * @param {string} id - The id
     * @param {UpdateUserDto} updateUserDto - The update user dto
     * @returns {User} - This action updates a #${id} user
     */
    @Patch(':id')
    update(@CurrentUser<User>() user, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto, user);
    }

    /**
     *
     * @param {User} user - The user authenticated
     * @param {string} id - The id
     * @returns {User} - This action removes a #${id} user
     */
    @Delete(':id')
    remove(@CurrentUser<User>() user, @Param('id') id: string) {
        return this.userService.remove(id, user);
    }
}
