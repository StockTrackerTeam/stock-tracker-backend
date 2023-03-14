import { Entity, Column, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from './role.entity';

@Entity()
export class User extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 50,
    unique: true
  })
    username: string;

  @Column({
    type: 'varchar',
    name: 'firstname'
  })
    firstName: string;

  @Column({
    type: 'varchar',
    name: 'lastname'
  })
    lastName: string;

  @Column({
    type: 'varchar',
    nullable: true,
    unique: true
  })
    email: string | null; // Todavia no sabemos si va o no

  @Column()
    password: string;

  @Column()
    isActive: boolean;

  @Column()
    roleId: number;

  @ManyToOne(() => Role, (role) => role.users)
    role: Role;
}
