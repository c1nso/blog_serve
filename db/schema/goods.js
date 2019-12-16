const mongoose = require('mongoose')
const Schema = mongoose.Schema

const goodsSchema = new Schema({

}, {
	collections: 'Goods'    // 指定数据库表名，不然表名会加s
})

mongoose.model('Goods', goodsSchema)
