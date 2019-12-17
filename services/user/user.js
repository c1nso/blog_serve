const Router = require('koa-router')
const mongoose = require('mongoose')
const router = new Router()
const errMsg = {
	code: 500,
	msg: '失败，请重试'
}
router.post('/register', async ctx => {
	const User = mongoose.model('User')
	let createUser = new User(ctx.request.body)
	await createUser.save().then(() => {
		ctx.body = {
			code: 0,
			msg:'注册成功'
		}
	}).catch(() => {
		ctx.body = errMsg
	})

})

router.post('/login', async ctx => {
	const loginUser = ctx.request.body;
	const {username, password} = loginUser;
	const User = mongoose.model('User')
	await User.findOne({username}).exec().then(async  result => {
		if(result) {
			const loginUser = new User()
			await loginUser.comparsePassword(password, result.password)
				.then(isMatch => {
					ctx.body = {
						code: 0,
						msg: isMatch
					}
				}).catch(() => {
					ctx.body = errMsg
				})
		}
	}).catch(err => {
		ctx.body = errMsg
	})
})

module.exports = router;
