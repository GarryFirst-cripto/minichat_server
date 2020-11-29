import authRoutes from './authRoutes';
import postRoutes from './postRoutes';
import commentRoutes from './commentRoutes';
import imageRoutes from './imageRoutes';

export default app => {
  app.use('/api/auth', authRoutes);
  app.use('/api/posts', postRoutes);
  app.use('/api/comments', commentRoutes);
  app.use('/api/images', imageRoutes);
  app.use('/pass/user', authRoutes);
  app.use('/pass/mail/', postRoutes);
};
