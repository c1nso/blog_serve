const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
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
