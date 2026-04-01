import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await authService.registerUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
