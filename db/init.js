const glob = require('glob')
const {resolve} = require('path')
const mongoose = require('mongoose'),
	DB_URL = 'mongodb://192.168.1.246:27017/blog'; // mongodb://root:123456@192.168.1.246:27017/test
exports.initSchemas = () => {
	glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}
exports.connect = ()=> {
	/**
	 * 连接
	 */
	let maxConnectTimes = 0;
	mongoose.connect(DB_URL,  {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true
	});
	return new Promise((resolve, reject) => {
		mongoose.connection.on('disconnected', (err) => {
			if (maxConnectTimes <= 3) {
				maxConnectTimes++;
				mongoose.connect(DB_URL)
			} else {
				reject(err);
				throw new Error('数据库异常')
			}
		});
		mongoose.connection.on('error', () => {
			if (maxConnectTimes <= 3) {
				maxConnectTimes++;
				mongoose.connect(DB_URL)
			} else {
				reject(err);
				throw new Error('数据库异常')
			}
		});
		mongoose.connection.once('open', () => {
			console.log('MongoDB connected successfully')
			resolve()
		});
	})

}

