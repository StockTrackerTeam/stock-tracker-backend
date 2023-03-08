import { type BaseEntity } from '../../entities/base.entity';

export interface IResult {
  statusCode: number
  message: string
  entity: BaseEntity | null
  resultKeys: string[]
}

export const RESULT_OK = 'ok';
export const USER_NOT_FOUND = 'user-not-found';
