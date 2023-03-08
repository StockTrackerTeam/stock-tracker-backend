import express from 'express';
const userRouter = express.Router();
import { UserController } from '../controllers/user.controllers';
const userController = new UserController();

userRouter.post('/', userController.createUser);

export default userRouter;