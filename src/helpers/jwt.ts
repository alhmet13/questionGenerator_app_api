import { inflateSync } from 'zlib';
import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';

import { logger } from '../libs';

const compressedACSPKey = process.env.ACCESS_PRIVATE_KEY_GLIB || '';
const compressedRSHPKey = process.env.REFRESH_PRIVATE_KEY_GLIB || '';

const accessPrivateKEY = inflateSync(Buffer.from(compressedACSPKey, 'base64')).toString('utf8');
const refreshPrivateKEY = inflateSync(Buffer.from(compressedRSHPKey, 'base64')).toString('utf8');

const signJwt = (payload: JwtPayload, key: 'access' | 'refresh', options: SignOptions = {}) => {
  const usedKey = key === 'access' ? accessPrivateKEY : refreshPrivateKEY;

  return jwt.sign(payload, usedKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};

const verifyJwt = (token: string, key: 'access' | 'refresh') => {
  const usedKey = key === 'access' ? accessPrivateKEY : refreshPrivateKEY;
  try {
    return jwt.verify(token, usedKey) as JwtPayload;
  } catch (error) {
    logger.error(`[verifyJwt ERROR]: ${error}`);
    return null;
  }
};

export { signJwt, verifyJwt };
