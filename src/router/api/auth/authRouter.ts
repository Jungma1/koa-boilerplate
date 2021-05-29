import Router from 'koa-router';
import { Context } from 'vm';

const authRouter = new Router();

authRouter.get('/test', (ctx: Context) => {
  ctx.body = 'test';
});

export default authRouter;
