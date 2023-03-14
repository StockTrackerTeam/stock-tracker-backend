import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import 'reflect-metadata';
import { Role } from './entities/role.entity';

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_DATABASE,
  entities: [User, Role],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
  synchronize: true
});

export async function connect (): Promise<DataSource> {
  await dataSource.initialize();
  console.log('Connected to PostgreSQL database');
  return dataSource;
}
