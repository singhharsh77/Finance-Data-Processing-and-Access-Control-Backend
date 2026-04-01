import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updatedUser = await userService.updateUserStatus(req.params.id as string, req.body);
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};
