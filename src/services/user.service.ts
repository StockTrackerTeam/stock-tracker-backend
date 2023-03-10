import { UserRepository } from '../repository/user.rerpository';
import { type UserCreateDTO } from '../dtos/user.dtos';
import { validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import { type IResult, RESULT_OK, USER_NOT_FOUND } from '../utils/interfaces/result.interface';
import { type User } from '../entities/user.entity';
import { extractErrorKeysFromErrors } from '../utils/functions';

const userRepository = new UserRepository();

export class UserService {
  async create (userCreateDTO: UserCreateDTO): Promise<IResult> {
    const errors = await validate(userCreateDTO);

    if (errors.length > 0) {
      console.log('errors: ', errors[0]);

      const errorKeys = extractErrorKeysFromErrors(errors);

      return {
        statusCode: StatusCodes.BAD_REQUEST,
        message: `Validation failed while creating user: ${errors}`,
        entity: null,
        resultKeys: errorKeys
      };
    }

    if (userCreateDTO.password !== userCreateDTO.confirmPassword) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'The password does not match, please try again.',
        entity: null,
        resultKeys: ['password-not-match']
      };
    }
    if (userCreateDTO.email !== '' && userCreateDTO.email !== userCreateDTO.confirmEmail) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'The email does not match, please try again.',
        entity: null,
        resultKeys: ['email-not-match']
      };
    }

    const userCreated = await userRepository.save({ ...userCreateDTO, isActive: true });

    return {
      statusCode: StatusCodes.CREATED,
      message: 'User created!',
      entity: userCreated,
      resultKeys: [RESULT_OK]
    };
  }

  async find (): Promise<User[]> {
    // TODO: add patterns for searching users
    return await userRepository.find();
  }

  async delete (id: number): Promise<IResult> {
    const userToDelete = await userRepository.findOneBy({ id });

    if (userToDelete == null) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        message: `No user found with ID: ${id}`,
        entity: null,
        resultKeys: [USER_NOT_FOUND]
      };
    }
    await userRepository.update(id, { deletedAt: new Date() });

    return {
      statusCode: StatusCodes.OK,
      message: `User with ID ${id} successfully deleted`,
      entity: null,
      resultKeys: [RESULT_OK]
    };
  }
}
