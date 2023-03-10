import { UserRepository } from '../repository/user.rerpository';
import { type UserCreateDTO, type UserUpdateDTO } from '../dtos/user.dtos';
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

  async update (id: number, userUpdateDTO: UserUpdateDTO): Promise<IResult> {
    const currentUser = await userRepository.findOneBy({ id });

    if (currentUser == null) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        message: `No user found with ID: ${id}`,
        entity: null,
        resultKeys: [USER_NOT_FOUND]
      };
    }
    const errors = await validate(userUpdateDTO);

    if (errors.length > 0) {
      const errorKeys = extractErrorKeysFromErrors(errors);

      return {
        statusCode: StatusCodes.BAD_REQUEST,
        message: `Validation failed while updating user: ${errors}`,
        entity: null,
        resultKeys: errorKeys
      };
    }

    if (userUpdateDTO.password !== '' && userUpdateDTO.confirmPassword !== userUpdateDTO.password) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'The password does not match, please try again.',
        entity: null,
        resultKeys: ['password-not-match']
      };
    }

    if (userUpdateDTO.email !== '' && userUpdateDTO.email !== userUpdateDTO.confirmEmail) {
      return {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'The email does not match, please try again.',
        entity: null,
        resultKeys: ['email-not-match']
      };
    }

    const { confirmEmail, confirmPassword, username, ...userUpdate } = userUpdateDTO;
    await userRepository.update(currentUser.id, userUpdate);
    const updatedUser = await userRepository.findOneBy({ id });

    if (username !== '') {
      return {
        statusCode: StatusCodes.OK,
        message: 'USERNAME cannot be changed! The other changes have been made.',
        entity: updatedUser,
        resultKeys: ['warning-username-change-attempt']
      };
    }

    return {
      statusCode: StatusCodes.OK,
      message: 'User updated!',
      entity: updatedUser,
      resultKeys: [RESULT_OK]
    };
  }
}
