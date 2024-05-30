import { Entity, Column, BeforeUpdate, BeforeInsert, Index } from 'typeorm';

import { BaseEntityClass, BcryptServiceInstance, UserRole } from '../../../common';

/**
 * The User entity class is an object that represents the data of a user.
 */
@Entity({
    name: 'users',
    comment: 'The table that contains the users',
})
export class User extends BaseEntityClass {
    @Column({
        comment: 'The name of the user',
        length: 100,
        name: 'name',
    })
    name: string;

    @Index({ unique: true })
    @Column({
        comment: 'The email of the user',
        length: 100,
        name: 'email',
    })
    email: string;

    @Column({
        comment: 'The password of the user',
        type: 'text',
        select: false,
        name: 'password',
    })
    password: string;

    @Column({
        comment: 'The role of the user',
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
        name: 'role',
    })
    role: UserRole;

    // Relations

    // Hooks

    /**
     * Hash the password before inserting or updating the user
     */
    @BeforeInsert()
    @BeforeUpdate()
    validateData() {
        if (this.password) {
            this.password = BcryptServiceInstance.hash(this.password);
        }

        if (this.email) {
            this.email = this.email.toLowerCase();
        }
    }

    // Methods

    /**
     *
     * @param {string} password - The password to compare
     * @returns {boolean} - The result of the comparison
     * @description Compare the password with the user password
     */
    comparePassword(password: string): boolean {
        return BcryptServiceInstance.compare(password, this.password);
    }
}
