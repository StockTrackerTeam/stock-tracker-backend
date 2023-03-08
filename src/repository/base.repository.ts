import { type EntityTarget, Repository } from 'typeorm';
import { dataSource } from '../db';
import { type BaseEntity } from '../entities/base.entity';

export abstract class BaseRepository<T extends BaseEntity> extends Repository<T> {
  protected constructor (entity: EntityTarget<T>) {
    super(entity, dataSource.manager);
  }
}
