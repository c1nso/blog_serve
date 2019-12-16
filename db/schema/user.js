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
		type: Date,
		default: Date.now()
	},
	lastLoginAt: {
		type: Date,
		default: Date.now()
	}
})
// 密码加盐、加密处理
userSchema.pre('save', (next) => {
	bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
		if (err) return next(err)
		bcrypt.hash(this.password, salt, (err, hash) => {
			if (err) return next(err)
			this.password = hash
			next()
		})
	})
})
// 登录密码比对
userSchema.method = {
	comparsePassword: (_password, password) => {
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
