import { PostReactionModel, PostModel, UserModel, ImageModel } from '../models/index';
import BaseRepository from './baseRepository';

class PostReactionRepository extends BaseRepository {
  getPostReaction(userId, postId) {
    return this.model.findOne({
      group: [
        'postReaction.id',
        'post.id'
      ],
      where: { userId, postId },
      include: [{
        model: PostModel,
        attributes: ['id', 'userId']
      }]
    });
  }

  getPostReactionList(filter) {
    const where = filter;
    return this.model.findAll({
      where,
      include: {
        model: UserModel,
        attributes: ['id', 'username'],
        include: {
          model: ImageModel,
          attributes: ['id', 'link']
        }
      }
    });
  }
}

export default new PostReactionRepository(PostReactionModel);
