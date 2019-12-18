const nodemailer = require('nodemailer');

//设置邮箱配置
let transporter = nodemailer.createTransport({
	host: 'smtp.qq.com',//邮箱服务的主机，如smtp.qq.com
	port: 465,//对应的端口号
	//开启安全连接
	secure: true,
	secureConnection: true,
	//用户信息
	auth:{
		user: '',
		pass: ''
	}
});


//发送邮件
const send = (mail, code) => {
	const mailObj = {
		from: '', // sender address
		to: mail, // list of receivers
		subject: "腾讯科技", // Subject line
		text: `您的验证码是${code}，有效期五分钟`, // plain text body
	}
	return new Promise((resolve, reject) => {
		transporter.sendMail(mailObj, (err, data) => {
			if(err) reject(err)
			resolve(data)
		});
	})
}

module.exports = {send}
