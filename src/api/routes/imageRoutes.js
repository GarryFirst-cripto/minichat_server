import { Router } from 'express';
import * as imageService from '../services/imageService';
import imageMiddleware from '../middlewares/imageMiddleware';

const router = Router();

router
  .post('/attachment', imageMiddleware, (req, res, next) => imageService.upload(req.file, req.body)
    .then(image => res.send(image))
    .catch(next))
  .post('/', imageMiddleware, (req, res, next) => imageService.createImage(req.body)
    .then(image => res.send(image))
    .catch(next))
  .delete('/deletetmpt', (req, res, next) => imageService.deleteTmptImage(req.body)
    .then(post => res.send(post))
    .catch(next))
  .delete('/:id', (req, res, next) => imageService.deleteImage(req.params.id)
    .then(post => res.send(post))
    .catch(next));

export default router;
