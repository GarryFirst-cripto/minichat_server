import sequelize from '../db/connection';
import { PostModel, CommentModel, UserModel, ImageModel, PostReactionModel } from '../models/index';
import BaseRepository from './baseRepository';

const likeCase = bool => `CASE WHEN "postReactions"."isLike" = ${bool} THEN 1 ELSE 0 END`;

class PostRepository extends BaseRepository {
  async getPosts(filter) {
    const {
      from: offset,
      count: limit,
      userId,
      mode
    } = filter;

    let where = { deleted: false };
    let filtr;
    const attr = [
      [sequelize.literal(`
        (SELECT COUNT(*)
        FROM "comments" as "comment"
        WHERE "comment"."deleted" = false and "post"."id" = "comment"."postId" )`), 'commentCount'],
      [sequelize.fn('SUM', sequelize.literal(likeCase(true))), 'likeCount'],
      [sequelize.fn('SUM', sequelize.literal(likeCase(false))), 'dislikeCount']
    ];
    if (userId) {
      switch (mode) {
        case '1':
          filtr = sequelize.literal(`post."userId" = '${userId}'`);
          where = Object.assign(where, { filtr });
          break;
        case '2':
          filtr = sequelize.literal(`post."userId" <> '${userId}'`);
          where = Object.assign(where, { filtr });
          break;
        default:
          attr.push([sequelize.literal(
            `(SELECT COUNT(*) FROM "public"."postReactions" WHERE "postReactions"."isLike" = true
            and "post"."id" = "postReactions"."postId" and "postReactions"."userId" = '${userId}')`
          ), 'mycount']);
      }
    }

    return this.model.findAll({
      where,
      attributes: {
        include: attr
      },
      include: [{
        model: ImageModel,
        attributes: ['id', 'link']
      }, {
        model: UserModel,
        attributes: ['id', 'username', 'status', 'email'],
        include: {
          model: ImageModel,
          attributes: ['id', 'link']
        }
      }, {
        model: PostReactionModel,
        attributes: [],
        duplicating: false
      }],
      group: [
        'post.id',
        'image.id',
        'user.id',
        'user->image.id'
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit
    });
  }

  async getPostById(id) {
    return this.model.findOne({
      group: [
        'post.id',
        'comments.id',
        'comments->user.id',
        'comments->user->image.id',
        'user.id',
        'user->image.id',
        'image.id'
      ],
      where: { id },
      attributes: {
        include: [
          [sequelize.literal(`
                        (SELECT COUNT(*)
                        FROM "comments" as "comment"
                        WHERE "comment"."deleted" = false and "post"."id" = "comment"."postId")`), 'commentCount'],
          [sequelize.fn('SUM', sequelize.literal(likeCase(true))), 'likeCount'],
          [sequelize.fn('SUM', sequelize.literal(likeCase(false))), 'dislikeCount']
        ]
      },
      include: [{
        model: CommentModel,
        attributes: [
          'id',
          'body',
          'deleted',
          [sequelize.literal(`(SELECT COUNT(*) FROM "public"."commentReactions" WHERE "commentReactions"."isLike" 
          = true and "comments"."id" = "commentReactions"."commentId")`), 'likeCou'],
          [sequelize.literal(`(SELECT COUNT(*) FROM "public"."commentReactions" WHERE "commentReactions"."isLike" 
          = false and "comments"."id" = "commentReactions"."commentId")`), 'dislikeCou']
        ],
        include: {
          model: UserModel,
          attributes: ['id', 'username', 'status'],
          include: {
            model: ImageModel,
            attributes: ['id', 'link']
          }
        }
      }, {
        model: UserModel,
        attributes: ['id', 'username', 'status', 'email'],
        include: {
          model: ImageModel,
          attributes: ['id', 'link']
        }
      }, {
        model: ImageModel,
        attributes: ['id', 'link', 'deleteHash']
      }, {
        model: PostReactionModel,
        attributes: []
      }]
    });
  }

  async updateById(id, data) {
    const result = await this.model.update(data, {
      where: { id },
      returning: true,
      plain: true
    });
    return result;
  }

  async updateByNoImage(id, data) {
    const result = await this.model.update({ body: data.body, imageId: null }, {
      where: { id },
      returning: true,
      plain: true
    });
    return result;
  }

  async getArhivPosts(filter) {
    const {
      from: offset,
      count: limit,
      userId
    } = filter;

    const where = { deleted: true, userId };
    return this.model.findAll({
      where,
      include: [{
        model: ImageModel,
        attributes: ['id', 'link']
      }, {
        model: UserModel,
        attributes: ['id', 'status'],
        include: {
          model: ImageModel,
          attributes: ['id', 'link']
        }
      }],
      group: [
        'post.id',
        'image.id',
        'user.id',
        'user->image.id'
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit
    });
  }
}

export default new PostRepository(PostModel);
