import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';

import { User } from '../../user/entities/user.entity';

/**
 * The RefreshToken entity class is an object that represents the data of a refresh token.
 * @class RefreshToken
 * @exports RefreshToken
 */
@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn('uuid')
    id: string; // Unique ID cho refresh token

    @Column({
        type: 'text',
    })
    token: string; // Token đã được mã hóa

    @Column({ type: 'boolean', default: true })
    isActive: boolean; // Trạng thái của token (active hoặc bị vô hiệu)

    @CreateDateColumn()
    createdAt: Date; // Thời gian tạo token

    @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'user_id',
        referencedColumnName: 'id',
    })
    user: User; // Mối quan hệ nhiều token cho một người dùng
}
