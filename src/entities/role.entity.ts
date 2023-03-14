import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
    id: number;

  @Column()
    label: string;

  @OneToMany(() => User, (user) => user.role)
    users: User[];
}
