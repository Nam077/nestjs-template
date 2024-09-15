import { ConflictException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUserDto } from './dto/find-all.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {
    CRUDInterface,
    FindOneOptionsCustom,
    findWithPaginationAndSearch,
    PaginationData,
    ResponseData,
    SearchField,
} from '../../common';
import { LoginDto } from '../auth/dtos/login.dto';

/**
 * @description User service implementation
 * User service implementation
 */
@Injectable()
export class UserService
    implements
        CRUDInterface<
            User,
            CreateUserDto,
            UpdateUserDto,
            ResponseData<User>,
            FindAllUserDto,
            PaginationData<User>,
            User
        >
{
    /**
     * @description Constructor of the UserService
     * @param {Repository<User>} userRepository - The user repository
     */
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    /**
     * @description Check if an email exists
     * @param {string} email - The email
     * @returns {Promise<boolean>} - Whether the email exists
     */
    async checkExistByEmail(email: string): Promise<boolean> {
        return await this.userRepository.exists({
            where: { email },
            withDeleted: true,
        });
    }

    /**
     * @description Create a new user
     * @param {CreateUserDto} createDTO - Create user data transfer object
     * @param {User} currentUser - The current user performing the action
     * @returns {Promise<ResponseData<User>>} - Response data
     */
    async create(createDTO: CreateUserDto, currentUser: User): Promise<ResponseData<User>> {
        const createdUser = await this.createEntity(createDTO);

        console.log(currentUser);

        return {
            status: HttpStatus.CREATED,
            message: 'User created successfully',
            data: createdUser,
        };
    }

    /**
     * @description Create a new user from the creation data transfer object
     * @param {CreateUserDto} createDTO - Create user data transfer object
     * @returns {Promise<User>} - User entity
     */
    async createEntity(createDTO: CreateUserDto): Promise<User> {
        const { name, email, role, password } = createDTO;
        const isEmailExist = await this.checkExistByEmail(email);

        if (isEmailExist) {
            throw new ConflictException('Email already exists');
        }

        const user = this.userRepository.create({
            name,
            email,
            role,
            password,
        });

        return await this.userRepository.save(user);
    }

    /**
     * @description Delete a user by id
     * @param {string} id - User id
     * @param {User} currentUser - The current user performing the action
     * @param {boolean} force - Force delete
     * @returns {Promise<ResponseData<User>>} - Response data
     */
    async delete(id: string, currentUser: User, force?: boolean): Promise<ResponseData<User>> {
        const deletedUser = await this.deleteEntity(id, force);

        return {
            status: HttpStatus.OK,
            message: 'User deleted successfully',
            data: deletedUser,
        };
    }

    /**
     * @description Delete a user by id
     * @param {string} id - User id
     * @param {boolean} force - Force delete
     * @returns {Promise<User>} - User entity
     */
    async deleteEntity(id: string, force?: boolean): Promise<User> {
        const user = await this.findOneOrFail(id);

        if (force) {
            await this.userRepository.remove(user);
        } else {
            await this.userRepository.softRemove(user);
        }

        return user;
    }

    /**
     * @description Find all users
     * @param {FindAllUserDto} findAllDTO - Find all user data transfer object
     * @param {User} currentUser - The current user performing the action
     * @returns {Promise<ResponseData<User>>} - Response data
     */
    async findAll(findAllDTO: FindAllUserDto, currentUser: User): Promise<ResponseData<User>> {
        const users = await this.findAllEntities(findAllDTO);

        console.log(currentUser);

        return {
            status: HttpStatus.OK,
            message: 'Users found successfully',
            ...users,
        };
    }

    /**
     * @description Find all users
     * @param {FindAllUserDto} findAllDTO - Find all user data transfer object
     * @param {boolean} includeDeleted - Include soft-deleted users if true
     * @returns {Promise<PaginationData<User>>} - Pagination data
     */
    async findAllEntities(findAllDTO: FindAllUserDto, includeDeleted?: boolean): Promise<PaginationData<User>> {
        const fields: Array<keyof User> = ['id', 'name', 'email', 'role'];
        const relations: string[] = [];
        const searchFields: SearchField[] = [];

        return await findWithPaginationAndSearch<User>(
            this.userRepository,
            findAllDTO,
            fields,
            includeDeleted || false,
            relations,
            searchFields,
        );
    }

    /**
     * @description Find one user by id
     * @param {string} id - User id
     * @param {User} currentUser - The current user performing the action
     * @returns {Promise<ResponseData<User>>} - Response data
     */
    async findOne(id: string, currentUser: User): Promise<ResponseData<User>> {
        const user = await this.findOneOrFail(id);

        console.log(currentUser);

        return {
            status: HttpStatus.FOUND,
            message: 'User found successfully',
            data: user,
        };
    }

    /**
     * @description Find one user by id
     * @param {string} id - User id
     * @param {FindOneOptionsCustom<User>} options - Find one options
     * @param {boolean} includeDeleted - Include soft-deleted user if true
     * @returns {Promise<User>} - User entity
     */
    async findEntityById(id: string, options?: FindOneOptionsCustom<User>, includeDeleted?: boolean): Promise<User> {
        return await this.userRepository.findOne({
            where: { id },
            withDeleted: includeDeleted,
            ...options,
        });
    }

    /**
     * @description Find one user by id or throw an exception if not found
     * @param {string} id - User id
     * @param {FindOneOptionsCustom<User>} options - Find one options
     * @param {boolean} includeDeleted - Include soft-deleted user if true
     * @returns {Promise<User>} - User entity
     */
    async findOneOrFail(id: string, options?: FindOneOptionsCustom<User>, includeDeleted?: boolean): Promise<User> {
        const user = await this.findEntityById(id, options, includeDeleted);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    /**
     * @description Remove a user by id (soft delete)
     * @param {string} id - User id
     * @param {User} currentUser - The current user performing the action
     * @returns {Promise<ResponseData<User>>} - Response data
     */
    async remove(id: string, currentUser: User): Promise<ResponseData<User>> {
        const removedUser = await this.softDeleteEntity(id);

        console.log(currentUser);

        return {
            status: HttpStatus.OK,
            message: 'User removed successfully',
            data: removedUser,
        };
    }

    /**
     * @description Remove a user by id (soft delete)
     * @param {string} id - User id
     * @returns {Promise<User>} - User entity
     */
    async softDeleteEntity(id: string): Promise<User> {
        const user = await this.findOneOrFail(id);

        await this.userRepository.softRemove(user);

        return user;
    }

    /**
     * @description Restore a user by id
     * @param {string} id - User id
     * @param {User} currentUser - The current user performing the action
     * @returns {Promise<ResponseData<User>>} - Response data
     */
    async restore(id: string, currentUser: User): Promise<ResponseData<User>> {
        const restoredUser = await this.restoreEntity(id);

        console.log(currentUser);

        return {
            status: HttpStatus.OK,
            message: 'User restored successfully',
            data: restoredUser,
        };
    }

    /**
     * @description Restore a user by id
     * @param {string} id - User id
     * @returns {Promise<User>} - User entity
     */
    async restoreEntity(id: string): Promise<User> {
        const user = await this.findOneOrFail(id, undefined, true);

        await this.userRepository.recover(user);

        return user;
    }

    /**
     * @description Update a user by id
     * @param {string} id - User id
     * @param {UpdateUserDto} updateDTO - Update user data transfer object
     * @param {User} currentUser - The current user performing the action
     * @returns {Promise<ResponseData<User>>} - Response data
     */
    async update(id: string, updateDTO: UpdateUserDto, currentUser: User): Promise<ResponseData<User>> {
        const updatedUser = await this.updateEntity(id, updateDTO);

        console.log(currentUser);

        return {
            status: HttpStatus.OK,
            message: 'User updated successfully',
            data: updatedUser,
        };
    }

    /**
     * @description Update a user by id
     * @param {string} id - User id
     * @param {UpdateUserDto} updateDTO - Update user data transfer object
     * @returns {Promise<User>} - User entity
     */
    async updateEntity(id: string, updateDTO: UpdateUserDto): Promise<User> {
        const user = await this.findOneOrFail(id);

        Object.assign(user, updateDTO);

        return await this.userRepository.save(user);
    }

    /**
     * @description Login a user by email and password
     * @param {LoginDto} loginDTO - The login data transfer object
     * @returns {Promise<User>} - The user entity
     * @throws {UnauthorizedException} - Unauthorized exception
     */
    async login(loginDTO: LoginDto): Promise<User> {
        const { email, password } = loginDTO;

        const user = await this.userRepository.findOne({
            where: { email },
            select: ['name', 'email', 'role', 'password'],
        });

        if (!user || !user.comparePassword(password)) {
            throw new UnauthorizedException('Invalid credentials');
        }

        delete user.password;

        return user;
    }
}
