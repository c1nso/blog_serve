const Router = require('koa-router')
const mongoose = require('mongoose')
const fs = require('fs')
const goodsSchema = require('../../db/schema/goods')
const router = new Router()

// 增加
router.post('/add', async ctx => {
	// const data = {
	// 	name: '火山飘雪11',
	// 	price: '333',
	// 	desc: '很好吃',
	// 	typeName: '凉菜',
	// 	typeId: 1,
	// 	image: '../../public/images/1.jpg'
	// }
	// 指定请求头Content-Type: application/json
	const data = ctx.request.body
	// const {name, price, desc, typeName, typeId, image} = data;
	await goodsSchema.goodsSchema.insertMany({...data}).then((data) => {
		ctx.body = {
			code: 0,
			msg: '添加成功'
		}
	}).catch((err) => {
		ctx.body = {
			code: 1,
			msg: '添加失败'
		}
	})
})

// 查询， 按类别查询
router.post('/getInfoByType', async ctx => {
	const {typeId} = ctx.request.body;
	await goodsSchema.goodsSchema.find({typeId}).then((data) => {
		ctx.body = {
			code: 0,
			msg: data
		}
	}).catch(() => {
		ctx.body = {
			code: 1,
			msg: '查询失败'
		}
	})
})

// 关键字查询kw,匹配名字和描述
router.post('/getInfoByKw', async ctx => {
	const {kw} = ctx.request.body
	const reg = new RegExp(kw)
	// await goodsSchema.goodsSchema.find({name: {$regex: reg}}).then((data) => {       // 名字模糊
	// 名字、描述双模糊查询
	// $and 连接查询
	await goodsSchema.goodsSchema.find({$or:[{name: {$regex: reg}},{desc: {$regex: reg}}]}).then((data) => {
		ctx.body = {
			code: 0,
			msg: data
		}
	}).catch(() => {
		ctx.body = {
			code: 1,
			msg: '查询失败'
		}
	})
})

// 删除 单条& 多条
router.post('/del', async ctx => {
	const {id} = ctx.request.body
	// 删除多个
	// await goodsSchema.goodsSchema.deleteMany({_id: [id1, id2]}).then(() => {
	try {
		const result = await goodsSchema.goodsSchema.find({_id: id});
		if (!result.length) return ctx.body = { code: 0, msg: '该记录不存在，请确认'}
		await goodsSchema.goodsSchema.deleteOne({_id: id}).then(() => {
			ctx.body = {
				code: 0,
				msg: '删除成功'
			}
		}).catch(() => {
			ctx.body = {
				code: 1,
				msg: '删除失败'
			}
		})
	} catch (e) {
		ctx.body = {
			code: 1,
			msg: '删除失败, 请重试'
		}
	}
})

// 修改
router.post('/update', async ctx => {
	// 指定请求头Content-Type: application/json
	const data = ctx.request.body
	const {_id} = data;
	// const {name, price, desc, typeName, typeId, image} = data;
	await goodsSchema.goodsSchema.updateOne({_id}, {...data}).then((data) => {
		ctx.body = {
			code: 0,
			msg: '修改成功'
		}
	}).catch((err) => {
		ctx.body = {
			code: 1,
			msg: '修改失败'
		}
	})
})


// 分页pageSize 每页数据条数
// page 哪一页
router.post('/getInfoByPage', async ctx => {
	const pageSize = ctx.request.body['pageSize'] || 5;
	const page = ctx.request.body['page'] || 1;
	await goodsSchema.goodsSchema.find().limit(Number(pageSize)).skip(Number((page -1) * pageSize)).then((data) => {
		ctx.body = {
			code: 0,
			msg: data
		}
	}).catch(() => {
		ctx.body = {
			code: 1,
			msg: '查询失败'
		}
	})
})

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
			code: 1,
			msg: e
		}
	}
})

module.exports = router;
