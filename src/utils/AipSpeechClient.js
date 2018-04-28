var AipSpeechClient = require("baidu-aip-sdk").speech;

// 设置APPID/AK/SK
var APP_ID = "21167806";
var API_KEY = "VIa7Oty5sQHsIHuEQGmNuxffa";
var SECRET_KEY = "SEQn77Ls3iCCXmvM9ag8n1iYf8mVNNsbc";

// 新建一个对象，建议只保存一个对象调用服务接口
var client = new AipSpeechClient(APP_ID, API_KEY, SECRET_KEY);


module.exports=client;