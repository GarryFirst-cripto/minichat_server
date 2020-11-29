import env from './dbConfig';

export const { secret } = env.app;
export const expiresIn = '24h';
export const expiresTmpt = 600;
