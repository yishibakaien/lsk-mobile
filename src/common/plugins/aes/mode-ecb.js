/**
 * Electronic Codebook block mode.
 */
/**
 * 这里的 iv 可以去掉没什么问题
 */
var CryptoJS = require('./aes');

CryptoJS.mode.ECB = (function() {
    var ECB = CryptoJS.lib.BlockCipherMode.extend();

    ECB.Encryptor = ECB.extend({
        processBlock: function(words, offset) {
            this._cipher.encryptBlock(words, offset);
        }
    });

    ECB.Decryptor = ECB.extend({
        processBlock: function(words, offset) {
            this._cipher.decryptBlock(words, offset);
        }
    });
    return ECB;
}());

var key = _pad0('zuoshibuguanzsbg', 16);
var iv = _pad0('1234567812345678', 16);

function str_repeat(target, n) {
    return (new Array(n + 1)).join(target);
}

//使用"\0"填充秘钥或向量
function _pad0(str, block_size) {
    if (str.length >= block_size) {
        return str.substr(0, block_size);
    } else {
        return str + str_repeat('\0', block_size - (str.length % block_size));
    }
}

function aes_encrypt(data, key, iv) { //加密
    var key = CryptoJS.enc.Utf8.parse(key);
    var iv = CryptoJS.enc.Utf8.parse(iv);
    var encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}
function aes(password) { //加密
    return aes_encrypt(password, key, iv); //密文
}
module.exports = aes;
