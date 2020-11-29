import postRepository from '../../data/repositories/postRepository';
import postReactionRepository from '../../data/repositories/postReactionRepository';
import { notification, notificLike } from './notificationService';

export const getPosts = filter => postRepository.getPosts(filter);

export const getArhivPost = filter => postRepository.getArhivPosts(filter);

export const getPostById = id => postRepository.getPostById(id);

export const create = async (userId, post) => {
  const result = await postRepository.create({
    ...post,
    userId,
    deleted: false
  });
  notification(userId, result.id, 'add_post');
  return result;
};

export const getReactPost = async postId => postReactionRepository.getPostReactionList(postId);

export const updatePost = async (userId, { postId, body, imageId }) => {
  const result = imageId
    ? postRepository.updateById(postId, { body, imageId })
    : postRepository.updateByNoImage(postId, { body });
  notification(userId, postId, 'upd_post');
  return result;
};

export const deletePost = async (userId, postId) => {
  const deleted = true;
  const result = await postRepository.updateById(postId, { deleted });
  notification(userId, postId, 'dell_post');
  return result;
};

export const restorePost = async (userId, { postId }) => {
  const deleted = false;
  const result = await postRepository.updateById(postId, { deleted });
  notification(userId, postId, 'add_post');
  return result;
};

export const setReaction = async (userId, { postId, isLike = true }) => {
  // define the callback for future use as a promise
  const updateOrDelete = react => (react.isLike === isLike
    ? postReactionRepository.deleteById(react.id)
    : postReactionRepository.updateById(react.id, { isLike }));
  const calcDopp = react => (react.isLike === isLike ? 0 : 1);
  const reaction = await postReactionRepository.getPostReaction(userId, postId);
  const result = reaction
    ? await updateOrDelete(reaction)
    : await postReactionRepository.create({ userId, postId, isLike });
  const dopp = reaction ? calcDopp(reaction) : 0;
  // the result is an integer when an entity is deleted
  if (Number.isInteger(result)) return { dopp };
  const id = postReactionRepository.getPostReaction(userId, postId);
  if (isLike) {
    notificLike(postId);
  }
  return ({ id, dopp });
};
