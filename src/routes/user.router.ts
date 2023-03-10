import express from 'express';
import { UserController } from '../controllers/user.controllers';
const userRouter = express.Router();
const userController = new UserController();

userRouter.post('/', userController.createUser);
userRouter.get('/', userController.getAllUsers);
userRouter.get('/:id', userController.getUser);
userRouter.put('/:id', userController.updateUser);
userRouter.patch('/state/:id', userController.changeUserState);
userRouter.delete('/:id', userController.deleteUser);

export default userRouter;
