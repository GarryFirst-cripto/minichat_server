import { Router } from 'express';
import * as postService from '../services/postService';
import * as mailService from '../services/mailService';

const router = Router();

router
  .get('/postlist', (req, res, next) => postService.getReactPost(req.query)
    .then(reactList => res.send(reactList))
    .catch(next))
  .get('/arhiv', (req, res, next) => postService.getArhivPost(req.query)
    .then(posts => res.send(posts))
    .catch(next))
  .get('/', (req, res, next) => postService.getPosts(req.query)
    .then(posts => res.send(posts))
    .catch(next))
  .get('/:id', (req, res, next) => postService.getPostById(req.params.id)
    .then(post => res.send(post))
    .catch(next))
  .post('/mail', (req, res, next) => mailService.sendMail(req.body)
    .then(mail => res.send(mail))
    .catch(next))
  .post('/', (req, res, next) => postService.create(req.user.id, req.body)
    .then(post => res.send(post))
    .catch(next))
  .put('/restore', (req, res, next) => postService.restorePost(req.user.id, req.body)
    .then(post => res.send(post))
    .catch(next))
  .put('/react', (req, res, next) => postService.setReaction(req.user.id, req.body)
    .then(reaction => res.send(reaction))
    .catch(next))
  .put('/', (req, res, next) => postService.updatePost(req.user.id, req.body)
    .then(post => res.send(post))
    .catch(next))
  .delete('/:id', (req, res, next) => postService.deletePost(req.user.id, req.params.id)
    .then(post => res.send(post))
    .catch(next));

export default router;
