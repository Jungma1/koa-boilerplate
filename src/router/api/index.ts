import Router from 'koa-router';
import authRouter from './auth/authRouter';

const api = new Router();

api.use('/auth', authRouter.routes());

export default api;
