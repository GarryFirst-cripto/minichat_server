import commentRepository from '../../data/repositories/commentRepository';
import commentReactionRepository from '../../data/repositories/commentReactionRepository';

export const create = (userId, comment) => commentRepository.create({
  ...comment,
  userId,
  deleted: false
});

export const getCommentById = id => commentRepository.getCommentById(id);

export const getReactComment = async commentId => commentReactionRepository.getCommentReactionList(commentId);

export const postComment = async (userId, { postId, body }) => {
  const result = commentRepository.create({ postId, userId, body });
  return result;
};

export const updateComment = async ({ commentId, body }) => {
  const result = commentRepository.updateById(commentId, { body });
  return result;
};

export const deleteComment = async commentId => {
  const deleted = true;
  const result = commentRepository.updateById(commentId, { deleted });
  return result;
};

export const setReaction = async (userId, { commentId, isLike = true }) => {
  // define the callback for future use as a promise
  const updateOrDelete = react => (react.isLike === isLike
    ? commentReactionRepository.deleteById(react.id)
    : commentReactionRepository.updateById(react.id, { isLike }));
  const calcDopp = react => (react.isLike === isLike ? 0 : 1);

  const reaction = await commentReactionRepository.getCommentReaction(userId, commentId);
  const result = reaction
    ? await updateOrDelete(reaction)
    : await commentReactionRepository.create({ userId, commentId, isLike });
  const dopp = reaction ? calcDopp(reaction) : 0;

  // the result is an integer when an entity is deleted
  if (Number.isInteger(result)) return { dopp };
  const id = commentReactionRepository.getCommentReaction(userId, commentId);
  return ({ id, dopp });
};
