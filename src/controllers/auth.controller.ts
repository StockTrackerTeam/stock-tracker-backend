/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Auth module
 */

/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       username:
 *         type: string
 *         description: The user's username
 *         validations: {
 *           minLength: 6,
 *           maxLength: 20
 *         }
 *       password:
 *         type: string
 *         description: The user's password
 *         validations: {
 *           minLength: 8,
 *           maxLength: 30
 *         }
 *   Token:
 *     type: string
 */

import { type Request, type Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UserRepository } from '../repository/user.rerpository';
import { plainToClass } from 'class-transformer';
import { loginDTO } from '../dtos/user.dtos';
import { AuthService } from '../services/auth.service';

export const userRepository = new UserRepository();
const authService = new AuthService();

export class AuthController {
  /**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       description: The username and password to login
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: the token of the user logged
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/definitions/Token'
 *       400:
 *         description: Invalid user data
 *       404:
 *         description: user not found
 *       500:
 *         description: Internal server error
 */
  async login (req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      if (username === undefined || password === undefined) {
        res.status(StatusCodes.BAD_REQUEST).send('Please, provide email and password');
        return;
      }

      const user = plainToClass(loginDTO, req.body);
      const result = await authService.login(user);

      res.status(result.statusCode).json({ message: result.message, token: result.token });
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(`Server error: ${error}`);
    }
  }
}
