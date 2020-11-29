// import sequelize from '../db/connection';
import { CommentModel, UserModel, ImageModel } from '../models/index';
import BaseRepository from './baseRepository';

// const likeCase = bool => `CASE WHEN "commentReactions"."isLike" = ${bool} THEN 1 ELSE 0 END`;

class CommentRepository extends BaseRepository {
  getCommentById(id) {
    return this.model.findOne({
      group: [
        'comment.id',
        'user.id',
        'user->image.id'
      ],
      where: { id },
      include: [{
        model: UserModel,
        attributes: {
          include: [
            'id',
            'username'
          ]
        },
        include: {
          model: ImageModel,
          attributes: ['id', 'link']
        }
      }]
    });
  }
}

export default new CommentRepository(CommentModel);
