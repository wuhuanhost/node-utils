var express = require('express');
var router = express.Router();



/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});



//发送socket消息
router.get('/msg', function(req, res, next) {
    var text = req.query.text;
    console.log(text)
    var io = global.socketdasdasdasdsad
    var id = global.iddadasdasdasdasd;
    io.sockets.to(id).emit('send-text', {
        data: text
    })

})




module.exports = router;