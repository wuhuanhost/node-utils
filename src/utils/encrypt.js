const crypto = require("crypto");
var CryptoJS = require("crypto-js");
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
        iv: iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
        format: CryptoJS.format.Hex //CBC模式需要加这个变量
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
        iv: iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
        format: CryptoJS.format.Hex
    });
    // console.log("value: " + decrypt.toString(CryptoJS.enc.Utf8));
    return decrypt.toString(CryptoJS.enc.Utf8);
}

const iv = crypto.randomBytes(16);
var key = MD5(iv);
console.log("TCL: key", key.length);
console.log("AES加密解密测试");
var data = "123456789";
console.log("加密字符串==>:" + data);
var serctData = aes256EncodeCBC(data, key, iv);
console.log("加密后的结果=====>");
console.log(serctData);
console.log("解密后的结果=====>");
console.log(aes256DecodeCBC(serctData, key, iv));

console.log();

exports.MD5 = MD5;

console.log("-----------------------");
const NodeRSA = require("node-rsa");

pkcsType = "pkcs8"; //不为空则 设置为传入参数，为空则 设置为 pkcs8
console.log("pkcsType=" + pkcsType);

// 1.创建RSA对象，并指定 秘钥长度
const key1 = new NodeRSA({ b: 512 });
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
