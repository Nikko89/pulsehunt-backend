require('dotenv').config();
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');
const compress = require('koa-compress');
const router = require('./router');
const logger = require('koa-logger');

const app = new Koa();

app.use(logger());
app.use(cors());
app.use(bodyParser());

app.use(router.routes());
app.use(router.allowedMethods());

app.use(compress());

// Server
const host = process.env.IP || 'localhost';
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running at http://${host}:${port}`);
});
