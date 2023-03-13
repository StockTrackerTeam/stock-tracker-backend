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
import { plainToClass, plainToInstance } from 'class-transformer';
import { UserCreateDTO, UserUpdateDTO } from '../dtos/user.dtos';
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

  /**
 * @swagger
 * /users:
 *   get:
 *     summary: Lists all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The user's list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/definitions/User'
 *       500:
 *         description: Internal server error
 */
  async getAllUsers (req: Request, res: Response): Promise<void> {
    // TODO: Add "orderBy" to order the list of users by a specific property
    try {
      const allUsers = await userService.find();

      res.status(StatusCodes.OK).json({ users: allUsers, count: allUsers.length });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error: ${error}`);
    }
  }

  /**
 * @swagger
 * /users/state/:id:
 *   patch:
 *     summary: Changes the state of an user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The user's state changed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/User'
 *       404:
 *         description: user not found
 *       500:
 *         description: Internal server error
 */
  async changeUserState (req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      const result = await userService.changeUserState(id);

      res.status(result.statusCode).send({ message: result.message });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error: ${error}`);
    }
  }

  /**
 * @swagger
 * /users/:id:
 *   get:
 *     summary: Finds a specific user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The user found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/User'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
  async getUser (req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const result = await userService.findOneById(id);

      res.status(result.statusCode).json({ message: result.message, entity: result.entity });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error: ${error}`);
    }
  }

  /**
 * @swagger
 * /users/:id:
 *   put:
 *     summary: Updates a specific user
 *     tags: [Users]
 *     requestBody:
 *       description: The user's properties to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: The user updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/User'
 *       404:
 *         description: user not found
 *       400:
 *         description: invalid user data
 *       500:
 *         description: Internal server error
 */
  async updateUser (req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);
      const userUpdate = plainToInstance(UserUpdateDTO, req.body);

      const result = await userService.update(id, userUpdate);

      res.status(result.statusCode).json({ message: result.message, entity: result.entity });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error: ${error}`);
    }
  }

  /**
 * @swagger
 * /users/:id:
 *   delete:
 *     summary: Deletes a specific user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Confirmation's message
 *       404:
 *         description: user not found
 *       500:
 *         description: Internal server error
 */
  async deleteUser (req: Request, res: Response): Promise<void> {
    try {
      const id = Number(req.params.id);

      const result = await userService.delete(id);

      res.status(result.statusCode).send({ user: result.entity, message: result.message });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error: ${error}`);
    }
  }
}
