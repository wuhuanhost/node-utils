var socketIo = require('socket.io');
var io;

exports.startSocket = function (server) {
  io = socketIo.listen(server)
  io.on('connection', function (socket) {
    console.log('socketIo  连接成功......')
    socket.emit('news', { data: 'hello world!!!' })
    socket.on('my other event', function (data) {
      console.log(data)
    })
})
}
