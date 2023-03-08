import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class User extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 50
  })
  username: string;

  @Column({
    type: 'varchar'
  })
  firstName: string;

  @Column({
    type: 'varchar'
  })
  lastName: string;

  @Column({
    type: 'varchar',
    nullable: true
  })
  email: string | null;  // Todavia no sabemos si va o no

  @Column()
  password: string;

  @Column()
  isActive: Boolean = true;
};