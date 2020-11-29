import { CommentReactionModel, CommentModel, UserModel, ImageModel } from '../models/index';
import BaseRepository from './baseRepository';

class CommentReactionRepository extends BaseRepository {
  getCommentReaction(userId, commentId) {
    return this.model.findOne({
      group: [
        'commentReaction.id',
        'comment.id'
      ],
      where: { userId, commentId },
      include: [{
        model: CommentModel,
        attributes: ['id', 'userId']
      }]
    });
  }

  getCommentReactionList(filter) {
    const where = filter;
    return this.model.findAll({
      where,
      include: [{
        model: UserModel,
        attributes: ['id', 'username'],
        include: [{
          model: ImageModel,
          attributes: ['id', 'link']
        }]
      }]
    });
  }
}

export default new CommentReactionRepository(CommentReactionModel);
