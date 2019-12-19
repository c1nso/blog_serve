const mongoose = require('mongoose')
const Schema = mongoose.Schema

const goodsSchema = new Schema({
	name: {
		type: String,
		unique: true,
		required: true
	},
	desc: {
		type: String
	},
	price: {
		type: String,
		required: true
	},
	typeName: {
		type: String
	},
	typeId: {
		type: Number
	},
	image: {
		type: String
	},
	createAt: {
		type: Date,
		default: Date.now().valueOf()
	},
	updateAt: {
		type: Date,
		default: Date.now().valueOf()
	}
}, {
	collections: 'Goods'    // 指定数据库表名，不然表名会加s
})


module.exports = {
	goodsSchema: mongoose.model('Goods', goodsSchema)
}
