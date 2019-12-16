const Router = require('koa-router')
const userApi = require('./user/user')
const homeApi = require('./user/home')
const goodsApi = require('./goods/goods')
const router = new Router()

router.use('/api', userApi.routes())
router.use('/api', homeApi.routes())
router.use('/api', goodsApi.routes())


module.exports = router
