const Router = require('koa-router')
const router = new Router()

router.get('/', async ctx => {
	ctx.body = '首页接口'
})

module.exports = router;
