const Router = require('koa-router')
const router = new Router()
const multer = require('@koa/multer');
const path = require('path')
const uploadPath = path.join(__dirname, '../../public/uploads')
let fileName = '';
const storage = multer.diskStorage({
	destination (req, file, cb) {
		cb(null, uploadPath)
	},
	filename(req, file, cb) {
		const types = file.originalname.split('.');
		const type = types[types.length - 1];
		fileName = `${file.fieldname}_${Date.now().toString(16)}.${type}`
		cb(null, fileName)
	}
})
const fileFilter =  (ctx, file ,cb) => {
	// 过滤上传的后缀为txt的文件
	const filterTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp']
	const fileType = file.originalname.split('.').splice(-1).toString();
	if (!filterTypes.includes(fileType)) return cb(null, false)
	return cb(null, true)
}
//文件上传限制
const limits = {
	fields: 10,     // 非文件字段的数量
	fileSize: 500 * 1024,    // 文件大小 单位 b
	// files: 1        // 文件数量
}
const upload = multer({ storage, limits, fileFilter})
// upload.single('upload') 指要上传图片数据的key
/**
 * {
 *     key: 图片数据
 * }
 *
 * */
router.post('/upload', async (ctx, next) => {
	try {
		const err = await upload.single('upload')(ctx, next)
		if (err) ctx.body = { code: 1, msg: err };
		ctx.body = {
			code: 0,
			data: `uploads/${fileName}`,
			msg: '上传成功'
		}
	} catch (e) {
		ctx.body = {
			code: 2,
			msg: e.message
		}
	}
})

router.post('/uploadMultipleFiles',
	upload.fields([
		{
			name: 'avatar',
			maxCount: 1
		},
		{
			name: 'boop',
			maxCount: 2
		}
	]),
	ctx => {
		console.log('ctx.request.files', ctx.request.files);
		console.log('ctx.files', ctx.files);
		ctx.body = 'done';
	}
);
module.exports = router;
