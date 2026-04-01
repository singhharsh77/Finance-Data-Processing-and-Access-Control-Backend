import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboard.service';

export const getSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const summary = await dashboardService.getDashboardSummary();
    res.status(200).json(summary);
  } catch (err) {
    next(err);
  }
};
