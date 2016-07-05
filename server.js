var koa = require('koa')();
var router = require('koa-router')();

var captcha = require('./index');

router
  .get('/image', function*(next) {
    let code = captcha.get(this);
    this.set('content-type', 'image/png');
    this.body = code[0];
  })
  .get('/check', function*(next) {
    this.body = {
      success: captcha.check(this, this.query.ticket)
    };
  });

koa
  .use(router.routes())
  .listen(3000);