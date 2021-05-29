import Router from 'koa-router';
import { register } from './auth.ctrl';

const authRouter = new Router();

authRouter.post('/register', register);

export default authRouter;
