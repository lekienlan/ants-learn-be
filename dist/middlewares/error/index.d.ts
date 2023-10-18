import type { NextFunction, Request, Response } from 'express';
import type ApiError from './ApiError';
export declare const errorHandler: (err: ApiError, _: Request, res: Response, _next: NextFunction) => void;
