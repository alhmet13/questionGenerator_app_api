import { randomBytes, scrypt, timingSafeEqual } from 'crypto';

const nrp = { N: 16384, r: 8, p: 1 };

const hashPassword = (password: string): Promise<string> => {
  const salt = randomBytes(12);

  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, nrp, (err, derivedKey) => {
      if (err) reject(err);
      const saltBase64 = salt.toString('base64'); // Base64 olarak saklıyoruz
      const hashBase64 = derivedKey.toString('base64'); // Hash'ı Base64 kodluyoruz
      resolve(`$2bz$${nrp.N}$${nrp.r}$${nrp.p}$${saltBase64}$${hashBase64}`);
    });
  });
};

const verifyPassword = (password: string, storedHash: string): Promise<boolean> => {
  const parts = storedHash.split('$');
  if (parts.length !== 7 || parts[1] !== '2bz') {
    throw new Error('Geçersiz hash formatı!');
  }

  const N = parseInt(parts[2]);
  const r = parseInt(parts[3]);
  const p = parseInt(parts[4]);
  const salt = Buffer.from(parts[5], 'base64');
  const storedKey = Buffer.from(parts[6], 'base64');

  return new Promise((resolve, reject) => {
    scrypt(password, salt, storedKey.length, { N, r, p }, (err, derivedKey) => {
      if (err) reject(err);
      resolve(timingSafeEqual(storedKey, derivedKey));
    });
  });
};

export { hashPassword, verifyPassword };
