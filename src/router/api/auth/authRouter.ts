import Router from 'koa-router';
import { login, register } from './auth.ctrl';

const authRouter = new Router();

authRouter.post('/register', register);
authRouter.post('/login', login);

export default authRouter;
