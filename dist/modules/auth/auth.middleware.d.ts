import type { NextFunction, Request, Response } from 'express';
declare const authMiddleware: (req: Request, _res: Response, next: NextFunction) => Promise<void>;
export default authMiddleware;
