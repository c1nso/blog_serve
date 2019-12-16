const Router = require('koa-router')
const mongoose = require('mongoose')
const fs = require('fs')
const router = new Router()

router.get('/insertAllGoodsInfo', async ctx => {
	fs.readFile('./newGoods.json', 'utf8', (err, data) => {
		data = JSON.parse(data)
		let saveCount = 0
		const Goods = mongoose.model('Goods')
		data.map((value, index) => {
			let createGoods = new Goods(value)
			createGoods.save().then(() => {
				saveCount++
			}).catch(err => {
				console.log(err)
			})
		})
	})
	ctx.body = '开始导入数据'
})

// 数据查询分页
router.post('/getGoodsListById', async ctx => {
	try {
		const {categroySubId, page} = ctx.request.body;
		const Goods = mongoose.model('Goods')
		let num = 10 // 每页显示数量
		let start = (page - 1) * num // 开始位置
		// const result = await Goods.find({SUB_ID: categroySubId}).exec()
		const result = await Goods.find({SUB_ID: categroySubId}).skip(start).limit(num).exec()
		ctx.body = {
			code: 0,
			msg: result
		}
	} catch (e) {
		ctx.body = {
			code: 500,
			msg: e
		}
	}
})

module.exports = router;
