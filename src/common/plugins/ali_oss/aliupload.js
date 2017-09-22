// var OSS = require('./ali_oss_jssdk.js');
// import uploadPictrue from 'utils/uploadPictrue';
import {token} from 'api/alioss';

const conf = require('config/domain');

var _ = {
    dir: '',
    region: conf.region,// process.env.NODE_ENV === 'prod' ? 'oss-cn-shenzhen' : 'oss-cn-shanghai', // 测试环境 oss-cn-shanghai，生产环境 oss-cn-shenzhen
    url: {
        base64Url: [],
        ossUrl: []
    }
};
function uuidMethod() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        // console.log('v值', v.toString(16));
        return v.toString(16);
    });
}

// fileType说明： -1：默认目录；0：常用；1：头像(个人、公司 包括banner)；2：相册(企业风采，素材库)；3：花型图片；4：供应和求购； 101：首页banner；102：新闻；103：广告(不定期更新)

/**
 * [aliupload description]
 * @param  {[type]}   fileType 上传图片的用途
 * @param  {Function} cb       成功回调
 * @param  {[type]}   err      错误回调
 */
export function aliupload(fileType, cb, err) {
    const files = this; // 这个this 指的是 input[type=file] DOM 元素
    const fileLen = files.files;
    const rFilter = /^(image\/jpeg|image\/png|image\/bmp)$/i;

    for (let i = 0; i < fileLen.length; i++) {
        let imgObj = fileLen[i];
        if (!rFilter.test(imgObj.type) && imgObj.type != '') {
            alert('图片格式不正确，请检查');
            return;
        }
        // 图片大小限制5MB以下
        if (imgObj.size <= 0 || imgObj.size >= 5242880) {
            alert('图片大小请限制在五兆以内');
            return;
        }
    };

    token({fileType: fileType}, function(res) {
        _.dir = res.data.dir;
        const client = new OSS.Wrapper({
            region: _.region,
            secure: conf.secure,// process.env.NODE_ENV === 'prod', // 测试环境 false 生产环境 true
            accessKeyId: res.data.accessKeyId,
            accessKeySecret: res.data.accessKeySecret,
            stsToken: res.data.securityToken,
            bucket: res.data.bucket
        });
        console.log('请求token的返回结果', res);

        if (fileLen) {
            for (let i = 0; i < fileLen.length; i++) {
                let file = fileLen[i];

                let storeAs = _.dir + 'web-' + uuidMethod().split('-').join('') + '.' + file.name.split('.')[file.name.split('.').length - 1];
                // 2
                client.multipartUpload(storeAs, file, {}).then((results) => {
                    // hide();
                    console.log('上传成功，返回值为', results);
                    // _.url.ossUrl.push(storeAs);
                    var urls = results.res.requestUrls;

                    var ret = urls.map(item => {
                        return item.split('?')[0];
                    });
                    cb(ret);
                    // console.log('multipartUpload后', _);
                }).catch((res) => {
                    err(res);
                });
            }
        }
    });
}

    