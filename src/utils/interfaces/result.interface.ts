import { BaseEntity } from '../../entities/base.entity';

export interface IResult {
  statusCode: number;
  message: String;
  entity: BaseEntity | null;
  resultKeys: String[];
}

export const RESULT_OK = 'ok';
export const USER_NOT_FOUND = 'user-not-found';