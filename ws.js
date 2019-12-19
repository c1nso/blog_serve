const WebSocket = require('ws')
const ws = new WebSocket.Server({port: 9000}, () => {
	console.log('socket start')
})
// 广播
let clients = [];
ws.on('connection', (client) => {
	clients.push(client)
	client.send('欢迎光临！') //数据传输字符串
	client.on('message', msg => {
		console.log(msg.includes('广播'))
		if (msg.includes('广播')) sendAll()
		console.log('来自前端的数据：' + msg)
	})
	client.on('close', msg => {
		console.log('前端关闭请求：', + msg)
	})
})


const sendAll = () => {
	for (let i = 0; i < clients.length; i++) {
		clients[i].send('服务端广播给你')
	}
}
