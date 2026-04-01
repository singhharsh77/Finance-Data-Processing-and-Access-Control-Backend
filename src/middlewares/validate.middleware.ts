import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({ error: 'Validation Error', details: (err as any).errors });
        return;
      }
      next(err);
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const parsedQuery = schema.parse(req.query) as any;
      Object.keys(req.query).forEach((key) => delete req.query[key]);
      Object.assign(req.query, parsedQuery);
      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        res.status(400).json({ error: 'Validation Error', details: (err as any).errors });
        return;
      }
      next(err);
    }
  };
};
