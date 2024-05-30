import { PrimaryGeneratedColumn, DeleteDateColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

/**
 * The base entity class.
 */
export abstract class BaseEntityClass {
    @PrimaryGeneratedColumn('uuid', {
        comment: 'The identifier',
    })
    id: string;

    @CreateDateColumn({
        comment: 'Date and time when the entity was created',
        name: 'created_at',
    })
    createdAt: Date;

    @UpdateDateColumn({
        comment: 'Date and time when the entity was last updated',
        name: 'updated_at',
    })
    updatedAt: Date;

    @DeleteDateColumn({
        comment: 'Date and time when the entity was deleted',
        name: 'deleted_at',
    })
    deletedAt: Date;
}
