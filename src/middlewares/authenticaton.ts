import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODE } from '../helpers';
import { verifyJwt } from '../helpers';
import { findUserById } from '../services';

const authentication = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).send({ message: 'Token Bulunamadı!' });
    }

    const decoded = verifyJwt(token, 'access');
    if (!decoded || !decoded.userId) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).send({ message: 'Token Geçersiz!' });
    }

    const user = await findUserById(decoded.userId);
    if (!user) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).send({ message: 'Kullanıcı Bulunamadı!' });
    }

    res.locals.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export { authentication };
