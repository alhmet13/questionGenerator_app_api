import { CookieOptions } from 'express';
import moment from 'moment';

const { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } = process.env;

const accessTokenCookieOptions: CookieOptions = {
  expires: moment().add(ACCESS_TOKEN_EXPIRES_IN, 'minutes').toDate(),
  maxAge: parseInt(ACCESS_TOKEN_EXPIRES_IN!) * 60 * 1000,
  httpOnly: true,
  secure: false, //HTTPS için burayı true yap. Eğer ki localhostta çalışıyorsan burayı false yap.
  sameSite: 'lax', //localhost için none yerine lax daha güvenli. HTTPS için none yap.
};
const refreshTokenCookieOptions: CookieOptions = {
  expires: moment().add(REFRESH_TOKEN_EXPIRES_IN, 'minutes').toDate(),
  maxAge: parseInt(REFRESH_TOKEN_EXPIRES_IN!) * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: false, //HTTPS için burayı true yap. Eğer ki localhostta çalışıyorsan burayı false yap.
  sameSite: 'lax', //localhost için none yerine lax daha güvenli. HTTPS için none yap.
};

export { accessTokenCookieOptions, refreshTokenCookieOptions };
