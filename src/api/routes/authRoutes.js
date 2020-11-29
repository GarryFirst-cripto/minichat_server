import { Router } from 'express';
import * as authService from '../services/authService';
import * as userService from '../services/userService';
import authenticationMiddleware from '../middlewares/authenticationMiddleware';
import registrationMiddleware from '../middlewares/registrationMiddleware';
import jwtMiddleware from '../middlewares/jwtMiddleware';
import userMiddleware from '../middlewares/userMiddleware';
import passwordMiddleware from '../middlewares/passwordMiddleware';

const router = Router();

// user added to the request (req.user) in a strategy, see passport config
router
  .post('/login', authenticationMiddleware, (req, res, next) => authService.login(req.user)
    .then(data => res.send(data))
    .catch(next))
  .post('/register', registrationMiddleware, (req, res, next) => authService.register(req.user)
    .then(data => res.send(data))
    .catch(next))
  .post('/reset', passwordMiddleware, (req, res, next) => userService.resetPassword(req.body, res.data)
    .then(data => res.send(data))
    .catch(next))
  .get('/email', (req, res, next) => userService.getUserByEmail(req.query)
    .then(data => res.send(data))
    .catch(next))
  .get('/user', jwtMiddleware, (req, res, next) => userService.getUserById(req.user.id)
    .then(data => res.send(data))
    .catch(next))
  .get('/newpwd', (req, res, next) => userService.getUserNewPwd(req.query)
    .then(data => res.send(data))
    .catch(next))
  .put('/', userMiddleware, (req, res, next) => userService.updateUserById(req.user.id, req.body, res.data)
    .then(data => res.send(data))
    .catch(next));

export default router;
