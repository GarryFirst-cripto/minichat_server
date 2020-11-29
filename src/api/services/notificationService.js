import postRepository from '../../data/repositories/postRepository';

export const sockets = [];

export const notification = (userId, postId, mode) => {
  for (let i = 0; i < sockets.length; i++) {
    if ((sockets[i].userId) && (sockets[i].userId !== userId)) {
      sockets[i].emit(mode, postId);
    }
  }
};

export const notificLike = postId => {
  postRepository.getPostById(postId)
    .then(post => {
      for (let i = 0; i < sockets.length; i++) {
        if (sockets[i].userId === post.userId) {
          sockets[i].emit('like', postId);
        }
      }
    })
    .catch();
};

export const notificJoin = (userId, username, mode) => {
  if (username) {
    for (let i = 0; i < sockets.length; i++) {
      if ((sockets[i].userId) && (sockets[i].userId !== userId)) {
        sockets[i].emit(mode, username);
      }
    }
  }
};
