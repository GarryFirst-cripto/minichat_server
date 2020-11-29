import { UserModel, ImageModel } from '../models/index';
import BaseRepository from './baseRepository';

class UserRepository extends BaseRepository {
  addUser(user) {
    return this.create(user);
  }

  async getByEmail(email) {
    const result = await this.model.findOne({ where: { email } });
    return result;
  }

  async getByUsername(username) {
    const result = await this.model.findOne({ where: { username } });
    return result;
  }

  async getUserById(id) {
    const result = await this.model.findOne({
      group: [
        'user.id',
        'image.id'
      ],
      where: { id },
      include: {
        model: ImageModel,
        attributes: ['id', 'link', 'deleteHash']
      }
    });
    return result;
  }
}

export default new UserRepository(UserModel);
