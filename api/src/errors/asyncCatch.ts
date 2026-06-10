import { NextFunction, Request, RequestHandler, Response } from 'express';

type RequestHandlerFn = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void | Promise<void | Response>;

export const catchErrors = (requestHandler: RequestHandlerFn): RequestHandler => {
  return (req, res, next): void => {
    Promise.resolve(requestHandler(req, res, next)).catch(next);
  };
};
