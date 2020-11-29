import dotenv from 'dotenv';

dotenv.config();

const env = {
  app: {
    port: process.env.APP_PORT,
    adress: process.env.APP_ADRESS,
    socketPort: process.env.SOCKET_PORT,
    secret: process.env.SECRET_KEY
  },
  db: {
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false
  },
  imgur: {
    imgurId: process.env.IMGUR_ID,
    imgurSecret: process.env.IMGUR_SECRET
  },
  smtp: {
    smtpUser: process.env.SMTP_USER,
    smtpClient: process.env.SMTP_CLIENT,
    smtpSecret: process.env.SMTP_SECRET,
    smtpToken: process.env.SMTP_TOKEN
  },
  port: process.env.PORT,
  use_env_variable: process.env.DATABASE_URL
};

export const { database, username, password, host, port, dialect, logging } = env.db;
export default env;
