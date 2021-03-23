import dotenv from 'dotenv';
import * as pgStringParser from 'pg-connection-string';

dotenv.config();

const herokuData = process.env.DATABASE_URL
  ? pgStringParser.parse(process.env.DATABASE_URL)
  : {};

const env = {
  app: {
    port: process.env.APP_PORT,
    adress: process.env.APP_ADRESS,
    socketPort: process.env.SOCKET_PORT,
    secret: process.env.SECRET_KEY
  },
  db: {
    database: herokuData.database || process.env.DB_NAME,
    username: herokuData.user || process.env.DB_USERNAME,
    password: herokuData.password || process.env.DB_PASSWORD,
    host: herokuData.host || process.env.DB_HOST,
    port: herokuData.port || process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      ssl: { rejectUnauthorized: false }
    },
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

export const { database, username, password, host, port, dialect, dialectOptions, logging } = env.db;
export default env;
