import { UserRepository } from '../repository/user.rerpository';
import { type loginDTO } from '../dtos/user.dtos';
import { validate } from 'class-validator';
import { StatusCodes } from 'http-status-codes';
import { USER_NOT_FOUND, RESULT_OK } from '../utils/interfaces/result.interface';
import { extractErrorKeysFromErrors } from '../utils/functions';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userRepository = new UserRepository();

export class AuthService {
  async login (user: loginDTO): Promise<any> {
    const errors = await validate(user);

    if (errors.length > 0) {
      const errorKeys = extractErrorKeysFromErrors(errors);

      return { // VALE LA PENA HACER OTRA INTERFACE?
        statusCode: StatusCodes.BAD_REQUEST,
        message: `Validation failed while updating user: ${errors}`,
        token: null,
        resultKeys: errorKeys
      };
    }

    const currentUser = await userRepository.findOneBy({ username: user.username });

    if (currentUser === null) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Username or password incorrect!',
        token: null,
        resultKeys: [USER_NOT_FOUND]
      };
    }

    const isPasswordCorrect = await bcrypt.compare(user.password, currentUser.password);

    if (!isPasswordCorrect) {
      return {
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Username or password incorrect!',
        token: null,
        resultKeys: [USER_NOT_FOUND]
      };
    }

    const token = jwt.sign({ userId: currentUser.id }, process.env.JWT_SECRET as string); // para que no rompa el JWT_SECRET usar ! o "as string", consultar con loren

    return {
      statusCode: StatusCodes.OK,
      message: 'Succesfully logged!',
      token,
      resultKeys: [RESULT_OK]
    };
  }
}
