import {
    ConflictException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUserDto } from './dto/find-all.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { CRUDInterface, FindOneOptionsCustom, ResponseData } from '../../common';
import { LoginDto } from '../auth/dtos/login.dto';

/**
 *
 */
@Injectable()
export class UserService
    implements CRUDInterface<User, CreateUserDto, UpdateUserDto, ResponseData<User>, FindAllUserDto>
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
        return await this.userRepository.existsBy({ email });
    }

    /**
     * @description Create a new user from the creation data transfer object
     * @param {CreateUserDto} createDTO - Create user data transfer object
     * @returns {Promise<ResponseData<User>>} - Response data
     * @throws {HttpException} - Http exception
     */
    async create(createDTO: CreateUserDto): Promise<ResponseData<User>> {
        const createdUser = await this.createHandler(createDTO);

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
     * @throws {HttpException} - Http exception
     */
    async createHandler(createDTO: CreateUserDto): Promise<User> {
        const { name, email, role, password } = createDTO;
        const isEmailExist = await this.checkExistByEmail(email);

        if (isEmailExist) {
            throw new ConflictException('Email already exists');
        }

        const user = new User();

        user.name = name;
        user.email = email;
        user.role = role;
        user.password = password;

        return await this.userRepository.save(user);
    }

    /**
     * @description Delete a user by id
     * @param {string} id - User id
     * @param {boolean} force - Force delete
     * @returns {Promise<ResponseData<User>>} - Response data
     * @throws {HttpException} - Http exception
     */
    async delete(id: string, force: boolean | undefined): Promise<ResponseData<User>> {
        return Promise.resolve(undefined);
    }

    /**
     * @description Delete a user by id
     * @param {string} id - User id
     * @param {boolean} force - Force delete
     * @returns {Promise<User>} - User entity
     */
    async deleteHandler(id: string, force: boolean | undefined): Promise<User> {
        return Promise.resolve(undefined);
    }

    /**
     * @description Find all users
     * @param {FindAllUserDto} findAllDTO - Find all user data transfer object
     * @returns {Promise<ResponseData<User>>} - Response data
     * @throws {HttpException} - Http exception
     */
    async findAll(findAllDTO: FindAllUserDto): Promise<ResponseData<User>> {
        return Promise.resolve(undefined);
    }

    /**
     * @description Find all users
     * @param {FindAllUserDto} findAllDTO - Find all user data transfer object
     * @returns {Promise<User[]>} - User entities
     * @throws {HttpException} - Http exception
     * @throws {Error} - Error
     */
    async findAllHandler(findAllDTO: FindAllUserDto): Promise<User[]> {
        return Promise.resolve([]);
    }

    /**
     * @description Find one user by id
     * @param {string} id - User id
     * @returns {Promise<ResponseData<User>>} - Response data
     * @throws {HttpException} - Http exception
     */
    async findOne(id: string): Promise<ResponseData<User>> {
        const user = await this.findOneOrFail(id);

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
     * @returns {Promise<User>} - User entity
     * @throws {HttpException} - Http exception
     */
    async findOneHandler(id: string, options?: FindOneOptionsCustom<User>): Promise<User> {
        return await this.userRepository.findOne({
            where: { id },
            ...options,
        });
    }

    /**
     * @description Find one user by id
     * @param {string} id - User id
     * @param {FindOneOptionsCustom<User>} options - Find one options
     * @returns {Promise<ResponseData<User>>} - Response data
     * @throws {HttpException} - Http exception
     */
    async findOneOrFail(id: string, options?: FindOneOptionsCustom<User>): Promise<User> {
        const user = await this.findOneHandler(id, options);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    /**
     * @description Remove a user by id
     * @param {string} id - User id
     * @returns {Promise<User>} - User entity
     * @throws {HttpException} - Http exception
     * @throws {Error} - Error
     */
    async remove(id: string): Promise<ResponseData<User>> {
        return Promise.resolve(undefined);
    }

    /**
     * @description Remove a user by id
     * @param {string} id - User id
     * @returns {Promise<User>} - User entity
     * @throws {HttpException} - Http exception
     * @throws {Error} - Error
     */
    async removeHandler(id: string): Promise<User> {
        return Promise.resolve(undefined);
    }

    /**
     * @description Restore a user by id
     * @param {string} id - User id
     * @returns {Promise<ResponseData<User>>} - Response data
     * @throws {HttpException} - Http exception
     */
    async restore(id: string): Promise<ResponseData<User>> {
        return Promise.resolve(undefined);
    }

    /**
     * @description Restore a user by id
     * @param {string} id - User id
     * @returns {Promise<User>} - User entity
     * @throws {HttpException} - Http exception
     * @throws {Error} - Error
     */
    async restoreHandler(id: string): Promise<User> {
        return Promise.resolve(undefined);
    }

    /**
     * @description Update a user by id
     * @param {string} id - User id
     * @param {UpdateUserDto} updateDTO - Update user data transfer object
     * @returns {Promise<ResponseData<User>>} - Response data
     * @throws {HttpException} - Http exception
     */
    async update(id: string, updateDTO: UpdateUserDto): Promise<ResponseData<User>> {
        return Promise.resolve(undefined);
    }

    /**
     * @description Update a user by id
     * @param {string} id - User id
     * @param {UpdateUserDto} updateDTO - Update user data transfer object
     * @returns {Promise<User>} - User entity
     * @throws {HttpException} - Http exception
     */
    async updateHandler(id: string, updateDTO: UpdateUserDto): Promise<User> {
        return Promise.resolve(undefined);
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
            select: {
                name: true,
                email: true,
                role: true,
                password: true,
            },
        });

        if (!user && !user.comparePassword(password)) {
            throw new UnauthorizedException('Invalid credentials');
        }

        delete user.password;

        return user;
    }
}
