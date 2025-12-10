import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { HTTP_STATUS_CODE } from '../helpers';

function validate(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map((issue: any) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }));
        res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({ error: 'Invalid data', details: errorMessages });
      } else {
        res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).send({ error: 'Interval Server Error' });
      }
    }
  };
}

export { validate };
