import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS_CODE, hashPassword, signJwt, accessTokenCookieOptions, refreshTokenCookieOptions, verifyPassword, verifyJwt } from '../helpers';
import { createUser, findUser, findUserById } from '../services';

const singUpHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await hashPassword(password);

    await createUser({ email, name, password: hashedPassword });

    return res.sendStatus(HTTP_STATUS_CODE.OK);
  } catch (error) {
    next(error);
  }
};

const signInHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  const { email, password } = req.body;
  try {
    const user = await findUser(email);

    if (!user) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).send({ message: 'Geçersiz email.' });
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(HTTP_STATUS_CODE.UNAUTHORIZED).send({ message: 'Geçersiz şifre.' });
    }

    const accessToken = signJwt({ userId: user.id, email: user.email }, 'access', { expiresIn: '15m' });
    const refreshToken = signJwt({ userId: user.id, email: user.email }, 'refresh', { expiresIn: '7d' });

    res.cookie('access_token', accessToken, accessTokenCookieOptions);
    res.cookie('refresh_token', refreshToken, refreshTokenCookieOptions);

    return res.sendStatus(HTTP_STATUS_CODE.OK);
  } catch (error) {
    next(error);
  }
};

const refreshTokenHandler = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const refresh_token = req.cookies.refresh_token;

    if (!refresh_token) {
      res.status(HTTP_STATUS_CODE.UNAUTHORIZED).send({ message: 'Refresh Token Bulunamadı!' });
    }

    const decoded = verifyJwt(refresh_token, 'refresh');

    if (!decoded || !decoded.userId) {
      return res.status(HTTP_STATUS_CODE.FORBIDDEN).send({ message: 'Geçersiz refresh token!' });
    }

    const findingUser = await findUserById(decoded.userId);

    if (findingUser === null) {
      return res.status(HTTP_STATUS_CODE.BAD_REQUEST).send({ message: 'User Bulunamadı!' });
    }

    const newAccessToken = signJwt({ userId: decoded.userId, email: decoded.userEmail }, 'access', { expiresIn: '15m' });

    res.cookie('access_token', newAccessToken, accessTokenCookieOptions);

    return res.sendStatus(HTTP_STATUS_CODE.OK);
  } catch (error) {
    next(error);
  }
};

export { singUpHandler, signInHandler, refreshTokenHandler };
