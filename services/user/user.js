const Router = require('koa-router')
const mongoose = require('mongoose')
const Mail = require('../../utils/mail')
const router = new Router()
const errMsg = {
	code: 1,
	msg: '失败，请重试'
}
let codeCache = {};
let isSend = true;
router.post('/register', async ctx => {
	const body = ctx.request.body;
	const {username, password, email, writeCode} = body;
	if (!Object.keys(codeCache).length) return ctx.body = {code: 1, msg: '请先获取邮箱验证码'}
	const { code, time } = codeCache
	const nowDate = new Date().valueOf();
	if (!username || !password) return ctx.body = {code: 1, msg: '用户名或密码不能为空'}
	if (!writeCode) return ctx.body = {code: 1, msg: '邮箱验证码有误，请重新输入'}
	if ((nowDate - time) / 1000 > 300) return ctx.body = {code: 1, msg: '邮箱验证码已过期，请重新获取'}
	if (parseInt(writeCode) !== parseInt(code)) return ctx.body = {code: 1, msg: '邮箱验证码有误，请重新输入'}
	if (codeCache['email'] !== email) return ctx.body = {code: 1, msg: '邮箱输入有误，请确认'}
	const User = mongoose.model('User')
	let createUser = new User(ctx.request.body)
	try {
		const checkUser = await User.find({username})
		if (checkUser.length) return ctx.body ={code: 1, msg: '用户名已存在'}
		await createUser.save({username, password, email}).then(() => {
			ctx.body = {
				code: 0,
				msg:'注册成功'
			}
		}).catch(() => {
			ctx.body = errMsg
		})
	} catch (e) {
		throw new Error(e)
	}

})

router.post('/login', async ctx => {
	const loginUser = ctx.request.body;
	const {username, password} = loginUser;
	if (!username || !password) return ctx.body ={code: 1, msg: '参数错误'}
	const User = mongoose.model('User')
	await User.findOne({username}).exec().then(async  result => {
		if(result) {
			const loginUser = new User()
			await loginUser.comparsePassword(password, result.password)
				.then(isMatch => {
					ctx.session.isLogin = true;
					ctx.session.name = username;
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

router.post('/getMailCode', async ctx => {
	const { email } = ctx.request.body;
	const code =  Math.floor((Math.random() * 1000000) + 1)
	if (!isSend) return ctx.body ={code: 1, msg: '请五分钟后重试'}
	try {
		const result = await Mail.send(email, code)
		if (result) {
			codeCache = {
				email,
				code,
				time: new Date().valueOf()
			};     // 发送成功保存当前验证码
			ctx.body = {
				code: 0,
				msg: '验证码发送成功'
			}
			isSend = false;
			setTimeout(() => {
				isSend = true;
			}, 1000 * 300)
		}
	} catch (e) {
		ctx.body = {
			code: 1,
			msg: '验证码发送失败，请确认'
		}
	}
})

module.exports = router;
