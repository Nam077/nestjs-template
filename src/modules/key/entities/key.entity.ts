import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { KeyType } from '../../../common';

/**
 * The entity that represents the key table in the database
 * @class
 * @name Key
 * @property {string} id - The key id
 * @property {string} encryptedKey - The key that is used to encrypt the data
 * @property {Date} createdAt - The date and time when the key was created
 */
@Entity({
    name: 'keys',
    comment: 'The table that contains the keys',
})
export class Key {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        nullable: false,
        comment: 'The key that is used to encrypt the data',
    })
    encryptedKey: string;

    @Column({
        type: 'enum',
        enum: KeyType,
        nullable: false,
        comment: 'The type of the key',
    })
    type: KeyType;

    @CreateDateColumn()
    createdAt: Date;
}
