/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User module
 */

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       id:
 *         type: number
 *         description: The user ID
 *       username:
 *         type: string
 *         description: The user's username
 *       firstName:
 *         type: string
 *         description: The user's firstname
 *       lastName:
 *         type: string
 *         description: The user's lasttname
 *       password:
 *         type: string
 *         description: The user's password
 *       email:
 *         type: string
 *         description: The user's email
 *       isActive:
 *         type: boolean
 *         description: Returns wheter the user is active or not
 *
 *   UserCreate:
 *     type: object
 *     properties:
 *       username:
 *         type: string
 *         description: The user's username
 *         validations: {
 *           minLength: 6,
 *           maxLength: 20
 *         }
 *       firstName:
 *         type: string
 *         description: The user's firstname
 *         validations: {
 *           maxLength: 50
 *         }
 *       lastName:
 *         type: string
 *         description: The user's lasttname
 *         validations: {
 *           maxLength: 50
 *         }
 *       password:
 *         type: string
 *         description: The user's password
 *         validations: {
 *           minLength: 8,
 *           maxLength: 30
 *         }
 *       confirmPassword:
 *         type: string
 *         description: confirm password
 *         validations: {
 *           minLength: 8,
 *           maxLength: 30
 *         }
 *       email:
 *         type: string
 *         description: The user's email
 *       confirmEmail:
 *         type: string
 *         description: confirm email
 */

import { type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserRepository } from '../repository/user.rerpository';
import { plainToClass } from 'class-transformer';
import { UserCreateDTO } from '../dtos/user.dtos';
import { UserService } from '../services/user.service';

export const userRepository = new UserRepository();
const userService = new UserService();

export class UserController {
  /**
 * @swagger
 * /users:
 *   post:
 *     summary: Creates a new user
 *     tags: [Users]
 *     requestBody:
 *       description: The user to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/UserCreate'
 *     responses:
 *       201:
 *         description: The user created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/User'
 *       400:
 *         description: Invalid user data
 *       500:
 *         description: Internal server error
 */
  async createUser (req: Request, res: Response): Promise<void> {
    try {
      const userCreate = plainToClass(UserCreateDTO, req.body);

      const result = await userService.create(userCreate);

      res.status(result.statusCode).json({ message: result.message, entity: result.entity });
    } catch (error: any) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error: ${error}`);
    }
  }
}
