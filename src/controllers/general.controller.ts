import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODE } from '../helpers';

const generalHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    return res.sendStatus(HTTP_STATUS_CODE.OK);
  } catch (error) {
    next(error);
  }
};

export { generalHandler };
