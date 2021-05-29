import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import jwtMiddleware from './lib/jwtMiddleware';
import router from './router';

const app = new Koa();

app.use(bodyParser());
app.use(jwtMiddleware);

app.use(router.routes());

export default app;
