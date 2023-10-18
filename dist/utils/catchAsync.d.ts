import type { NextFunction, Request, Response } from 'express';
declare const catchAsync: (fn: any) => (req: Request, res: Response, next: NextFunction) => void;
export default catchAsync;
