import http from 'http';
import Koa from 'koa';
import cors from '@koa/cors';
import { koaBody } from 'koa-body';
import { data } from './data.js';
import slow from 'koa-slow';
import Router from 'koa-router';

const app = new Koa();

app.use(koaBody({
    urlencoded: true,
    multipart: true,
}));

app.use(cors());

app.use(slow({
    url: /\/films\/new$/i,
    delay: 1500,
}));

const router = new Router();

router.get('/films/new', async (ctx) => {
    const response = data.map(el => ({
        content: el.content,
        img: el.img,
        date: Date.now(),
    }));
    ctx.response.body = JSON.stringify(response);
});

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 10000;

const server = http.createServer(app.callback());

server.listen(port, (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('Server is listening to ' + port);
});
