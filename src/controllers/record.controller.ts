import { Request, Response, NextFunction } from 'express';
import * as recordService from '../services/record.service';

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).user!.userId;
    const record = await recordService.createRecord(userId, req.body);
    res.status(201).json(record);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const recordId = req.params.id as string;
    const record = await recordService.updateRecord(recordId, req.body);
    res.status(200).json(record);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const recordId = req.params.id as string;
    await recordService.deleteRecord(recordId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filters = req.query as { category?: string; type?: string; startDate?: string; endDate?: string };
    const records = await recordService.getRecords(filters);
    res.status(200).json(records);
  } catch (err) {
    next(err);
  }
};

export const getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const record = await recordService.getRecordById(req.params.id as string);
    res.status(200).json(record);
  } catch (err) {
    next(err);
  }
};
