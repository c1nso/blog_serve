const Router = require('koa-router')
const userApi = require('./user/user')
const homeApi = require('./user/home')
const goodsApi = require('./goods/goods')
const uploadApi = require('./file/file')
const router = new Router()

router.use('/api', userApi.routes())
router.use('/api', homeApi.routes())
router.use('/goods', goodsApi.routes())
router.use('/file', uploadApi.routes())


module.exports = router
