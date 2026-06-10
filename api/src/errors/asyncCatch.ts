import { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void | Response>;

export const catchErrors = (requestHandler: AsyncRequestHandler): RequestHandler => {
  return (req, res, next): void => {
    requestHandler(req, res, next).catch(next);
  };
};
