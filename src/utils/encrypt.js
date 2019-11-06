const crypto = require("crypto");
var CryptoJS = require("crypto-js");
const NodeRSA = require("node-rsa");
/**
 * md5加密
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
var MD5 = function(str) {
    var hash = crypto.createHash("md5");
    hash.update(str);
    return hash.digest("hex");
};

//sha1加密
function sha1(str) {
    var sha1 = crypto.createHash("sha1");
    sha1.update(str);
    var sha1Str = sha1.digest("hex");
    return sha1Str;
}

/**
 * aes加密
 * @param data 待加密内容
 * @param key 必须为32位私钥
 * @returns {string}
 */
function aes256EncodeCBC(data, key, iv) {
    var encrypt = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv), //CBC模式需要格式化
        // iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
        // format: CryptoJS.format.Hex //返回的数据格式
    });
    // console.log("value: " + encrypt);
    return encrypt.toString();
}

/**
 * aes解密
 * @param data 待解密内容
 * @param key 必须为32位私钥
 * @returns {string}
 */
function aes256DecodeCBC(data, key, iv) {
    var decrypt = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), {
        iv: CryptoJS.enc.Utf8.parse(iv),
        // iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
        // format: CryptoJS.format.Hex
    });
    // console.log("value: " + decrypt.toString(CryptoJS.enc.Utf8));
    return decrypt.toString(CryptoJS.enc.Utf8);
}

// 向量（向量长度为16,24,32对应AES128,AES192,AES256）目前好像只能使用AES128位加密
const iv = "0000000000000000";
console.log("TCL: iv", iv);
// 秘钥
var key = "11111111111111111111111111111111";
console.log("TCL: key", key);
console.log("AES加密解密测试");
var data = "123456789";
console.log("加密字符串==>:" + data);
var serctData = aes256EncodeCBC(data, key, iv);
console.log("加密后的结果=====>");
console.log(serctData);
console.log("解密后的结果=====>");
console.log(aes256DecodeCBC(serctData, key, iv));

exports.MD5 = MD5;

/**
 * RSA测试
 */
function RSATest() {
    console.log("-----------------------RSA加密解密测试-------------------------------------------");

    pkcsType = "pkcs8"; //不为空则 设置为传入参数，为空则 设置为 pkcs8,常用pkcs8和pkcs1
    console.log("pkcsType=" + pkcsType);

    // 1.创建RSA对象，并指定 秘钥长度
    const key1 = new NodeRSA({ b: 2048 }); //秘钥长度512,1024,2048越长越安全
    key1.setOptions({ encryptionScheme: "pkcs1" }); //指定加密格式

    // 2.生成 公钥私钥，使用 pkcs8标准，pem格式
    var publicPem = key1.exportKey(pkcsType + "-public-pem"); //制定输出格式
    var privatePem = key1.exportKey(pkcsType + "-private-pem");
    //console.log(key.$options);
    console.log(pkcsType + "公钥:\n", publicPem);
    console.log(pkcsType + "私钥:\n", privatePem);

    var encryData = key1.encryptPrivate(data, "base64", "utf8");
    console.log("\n私钥加密后的数据：\n", encryData); //加密后数据为 base64 编码

    // 4.使用 公钥 解密 数据，并指定字符集
    var decryptData = key1.decryptPublic(encryData, "utf8");
    console.log("\n公钥解密后的数据：\n", decryptData);

    console.log("==================================================================1");
    // 1. 公钥
    var publicKey = new NodeRSA({ b: 512 });

    // 2.导入 公钥，并指定使用 pkcs标准，pem格式
    publicKey.importKey(publicPem, pkcsType + "-public-pem");

    // 3.使用 公钥 解密数据
    var decrypted = publicKey.decryptPublic(encryData, "utf8");
    console.log("\n使用公钥解密后的数据：\n", decrypted);

    //---------------------demo3：服务端使用私钥签名------------------------

    // 1. 私钥
    var privateKey = new NodeRSA({ b: 512 });

    // 2.导入 私钥，并指定使用 pkcs标准，pem格式
    privateKey.importKey(privatePem, pkcsType + "-private-pem");

    var signedData = privateKey.sign(Buffer.from(data), "base64").toString("base64");

    console.log("\n使用私钥签名:", signedData);

    //---------------------demo4：服务端使用公钥验证签名---------------------

    var result = publicKey.verify(Buffer.from(data), signedData, "utf8", "base64");

    console.log("\n验证签名结果", result);
}

// RSATest();
// SHA256 算法
console.log("----------------------------------------------------sha256------------------------------");
console.log(CryptoJS.HmacSHA256("111", "111").toString());
console.log(CryptoJS.SHA256("111").toString());
