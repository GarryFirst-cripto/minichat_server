import jwt from 'jsonwebtoken';
import { secret, expiresIn, expiresTmpt } from '../config/jwtConfig';

export const createToken = data => jwt.sign(data, secret, { expiresIn });

export const createTmptToken = data => jwt.sign(data, secret, { expiresIn: expiresTmpt });

export const fetchTokenData = token => {
  if (token) {
    try {
      return jwt.verify(token, secret);
    } catch (e) {
      return null;
    }
  };
  return null;
};
