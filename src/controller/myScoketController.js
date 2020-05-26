var socketIo = require("socket.io");
var io;
var path = require("path");
var fs = require("fs");

var baiduClient = require("../utils/AipSpeechClient.js");
var baiduMp3Path = path.resolve(
  __dirname,
  "../",
  "../",
  "public",
  "uploads",
  "baidu-mp3"
);

exports.startSocket = function(server) {
  io = socketIo.listen(server);
  console.log(io.sockets.sockets);
  global.socketdasdasdasdsad = io;
  io.on("connection", function(socket) {
    console.log("socketIo  连接成功......");
    // console.log(socket)
    global.iddadasdasdasdasd = socket.id;
    socket.emit("news", { data: "hello world!!!" });
    socket.on("my other event", function(data) {
      console.log(data);
    });

    //百度语音合成测试
    socket.on("send-text", function(data) {
      var text = data.data;
      console.log(">>>>>>>>>>>" + text);
      baiduClient.text2audio(text).then(
        function(result) {
          if (result.data) {
            fs.writeFileSync(
              path.join(baiduMp3Path, "baidutest.mp3"),
              result.data
            );
            socket.emit("play-video", {
              data: "/uploads/baidu-mp3/baidutest.mp3"
            });
          } else {
            // 服务发生错误
            console.log(result);
          }
        },
        function(e) {
          // 发生网络错误
          console.log(e);
        }
      );
    });
  });
};
