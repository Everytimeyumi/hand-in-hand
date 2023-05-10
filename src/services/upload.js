var CosAuth = require('./cos-auth'); // 这里引用了 cos-auth.js，下载地址为 https://unpkg.com/cos-js-sdk-v5/demo/common/cos-auth.min.js 

var Bucket = 'examplebucket-1250000000';
var Region = 'ap-shanghai';
var ForcePathStyle = false; // 是否使用后缀式，涉及签名计算和域名白名单配置，后缀式说明看上文
import Taro from '@tarojs/taro'
var uploadFile = function () {

    // 请求用到的参数
    var prefix = 'https://' + Bucket + '.cos.' + Region + '.myqcloud.com/';
    if (ForcePathStyle) {
        // 后缀式请求在签名时域名使用地域域名，而不是存储桶域名，具体说明见本文上述“3.后缀式请求”
        prefix = 'https://cos.' + Region + '.myqcloud.com/' + Bucket + '/'; 
    }

    // 对更多字符编码的 url encode 格式
    var camSafeUrlEncode = function (str) {
        return encodeURIComponent(str)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A');
    };

    // 获取临时密钥
    var stsCache;
    var getCredentials = function (callback) {
        if (stsCache && Date.now() / 1000 + 30 < stsCache.expiredTime) {
            callback(data.credentials);
            return;
        }
        taro.request({
            method: 'GET',
            url: 'https://example.com/sts.php', // 服务端签名，参考上文说的获取临时密钥
            dataType: 'json',
            success: function (result) {
                var data = result.data;
                var credentials = data.credentials;
                if (credentials) {
                    stsCache = data
                } else {
                    TaroshowModal({title: '临时密钥获取失败', content: JSON.stringify(data), showCancel: false});
                }
                callback(stsCache && stsCache.credentials);
            },
            error: function (err) {
                TaroshowModal({title: '临时密钥获取失败', content: JSON.stringify(err), showCancel: false});
            }
        });
    };

    // 计算签名
    var getAuthorization = function (options, callback) {
        getCredentials(function (credentials) {
            callback({
                XCosSecurityToken: credentials.sessionToken,
                Authorization: CosAuth({
                    SecretId: credentials.tmpSecretId,
                    SecretKey: credentials.tmpSecretKey,
                    Method: options.Method,
                    Pathname: options.Pathname,
                })
            });
        });
    };

    // post上传文件
    var postFile = function (filePath) {
        var Key = filePath.substr(filePath.lastIndexOf('/') + 1); // 这里指定上传的文件名
        var signPathname = '/'; // PostObject 接口 Key 是放在 Body 传输，所以请求路径和签名路径是 /
        if (ForcePathStyle) {
              // 后缀式请求在签名时用的路径，要包含存储桶名称，具体说明见本文上述“3.后缀式请求”
            signPathname = '/' + Bucket + '/';  
        }
        getAuthorization({Method: 'POST', Pathname: signPathname}, function (AuthData) {
            var requestTask = TarouploadFile({
                url: prefix,
                name: 'file',
                filePath: filePath,
                formData: {
                    'key': Key,
                    'success_action_status': 200,
                    'Signature': AuthData.Authorization,
                    'x-cos-security-token': AuthData.XCosSecurityToken,
                    'Content-Type': '',
                },
                success: function (res) {
                    var url = prefix + camSafeUrlEncode(Key).replace(/%2F/g, '/');
                    if (/^2\d\d$/.test('' + res.statusCode)) {
                        TaroshowModal({title: '上传成功', content: url, showCancel: false});
                    } else {
                        TaroshowModal({title: '上传失败', content: JSON.stringify(res), showCancel: false});
                    }
                },
                fail: function (res) {
                    TaroshowModal({title: '上传失败', content: JSON.stringify(res), showCancel: false});
                }
            });
            requestTask.onProgressUpdate(function (res) {
            });
        });
    };

    // put上传文件
    var putFile = function (filePath) {
        var Key = filePath.substr(filePath.lastIndexOf('/') + 1); // 这里指定上传的文件名
        var signPathname = '/' + Key; // PutObject 接口 Key 是放在 url 传输，所以请求路径和签名路径是 /Key
        if (ForcePathStyle) {
              // 后缀式请求在签名时用的路径，要包含存储桶名称，具体说明见本文上述“3.后缀式请求”
            signPathname = '/' + Bucket + '/' + Key;  
        }
        getAuthorization({Method: 'PUT', Pathname: signPathname}, function (AuthData) {
          // put请求需要从文件临时路径读取出文件内容
          var wxfs = taro.getFileSystemManager();
          wxfs.readFile({
            filePath: filePath,
            success: function (fileRes) {
              var requestTask = taro.request({
                url: prefix + signPathname.substr(signPathname.lastIndexOf('/') + 1),
                method: 'PUT',
                header: {
                  'Authorization': AuthData.Authorization,
                  'x-cos-security-token': AuthData.XCosSecurityToken,
                },
                data: fileRes.data,
                success: function success(res) {
                  var url = prefix + camSafeUrlEncode(Key).replace(/%2F/g, '/');
                  if (res.statusCode === 200) {
                      TaroshowModal({title: '上传成功', content: url, showCancel: false});
                  } else {
                      TaroshowModal({title: '上传失败', content: JSON.stringify(res), showCancel: false});
                  }
                },
                fail: function fail(res) {
                  TaroshowModal({title: '上传失败', content: JSON.stringify(res), showCancel: false});
                },
              });
              requestTask.onProgressUpdate(function (res) {
              });
            },
          });
        });
    };

    // 选择文件
    TarochooseImage({
        count: 1, // 默认9
        sizeType: ['original'], // 可以指定是原图还是压缩图，这里默认用原图
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            putFile(res.tempFiles[0].path); // put请求上传，推荐使用
            // postFile(res.tempFiles[0].path); // post请求上传
        }
    })
};


