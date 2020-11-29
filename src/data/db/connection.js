import Sequelize from 'sequelize';
import env, * as config from '../../config/dbConfig';

const adapter = env.use_env_variable
  ? new Sequelize(env.use_env_variable)
  : new Sequelize(config);

export default adapter;
