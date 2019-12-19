const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
const session = require('koa-session');
const {connect, initSchemas} = require('./db/init')
const api = require('./services/')
const app = new Koa()
const router = new Router()
const serve = require('koa-static-server')
const staticPath = path.join(__dirname, './public')
app.use(serve({rootDir: staticPath}))
app.use(cors())
app.use(bodyParser())
router.use(api.routes())

// 路由中间件
app.use(router.routes())
app.use(router.allowedMethods())
app.keys = ['blog app'];
const CONFIG = {
	key: 'fdskfjksdjfk',
	maxAge: 60 * 1000 * 60 * 24,
	autoCommit: true, /** (boolean) automatically commit headers (default true) */
	overwrite: true, /** (boolean) can overwrite or not (default true) */
	httpOnly: true, /** (boolean) httpOnly or not (default true) */
	signed: true, /** (boolean) signed or not (default true) */
	rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
	renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
app.use(session(CONFIG, app))
;(async () => {
	await connect()
	initSchemas()
	// const User = mongoose.model('User')
	// let createUser = new User({username: 'test02', password: '123456'})
	// createUser.save().then(() => {
	// 	console.log('插入成功')
	// })
	// let findUser = await User.findOne({}).exec()
	// console.log(`findUser: ${findUser}`)
})()

app.listen(3000, () => {
	console.log('Server is start on 3000')
})
