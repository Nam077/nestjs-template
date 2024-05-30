import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUserDto } from './dto/find-all.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

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
     * @param {CreateUserDto} createUserDto - The create user dto
     * @returns {User} - This action adds a new user
     */
    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    /**
     * @param {FindAllUserDto} findAllUserDto - The find all user dto
     * @returns {User[]} - This action returns all user'
     */
    @Get()
    findAll(@Query() findAllUserDto: FindAllUserDto) {
        return this.userService.findAll(findAllUserDto);
    }

    /**
     *
     * @param {string} id - The id
     * @returns {User} - This action returns a #${id} user
     */
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    /**
     *
     * @param {string} id - The id
     * @param {UpdateUserDto} updateUserDto - The update user dto
     * @returns {User} - This action updates a #${id} user
     */
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.userService.update(id, updateUserDto);
    }

    /**
     *
     * @param {string} id - The id
     * @returns {User} - This action removes a #${id} user
     */
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }
}
