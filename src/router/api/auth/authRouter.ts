import Router from 'koa-router';
import { check, login, register, logout } from './auth.ctrl';

const authRouter = new Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/check', check);

export default authRouter;
