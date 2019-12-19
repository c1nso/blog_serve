const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const SALT_WORK_FACTOR = 10; // 加盐程度

const userSchema = new Schema({
	userId: ObjectId,
	username: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String
	},
	createAt: {
		type: Number,
		default: Date.now().valueOf()
	},
	lastLoginAt: {
		type: Number,
		default: Date.now().valueOf()
	}
})
// 密码加盐、加密处理
userSchema.pre('save', function(next) {
	const _this = this;
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err)
		bcrypt.hash(_this.password, salt, function(error, hash) {
			if (error) return next(error)
			_this.password = hash
			next()
		})
	})
})
// 登录密码比对
userSchema.methods = {
	comparsePassword(_password, password) {
		return new Promise((resolve, reject) => {
			bcrypt.compare(_password, password, (err, isMatch) => {
				if(!err) resolve(isMatch)
				else reject(err)
			})
		})
	}
}
// 发布模型
mongoose.model('User', userSchema)
