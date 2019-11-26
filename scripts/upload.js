const platform = require('os').platform();
const qiniu = require('qiniu');
const path = require('path');
const yaml = require('yaml');
const fs = require('fs');
const https = require('https');

const pkj = require('../package.json');
const version = pkj.version;
const { qiniu: { PREFIX_URL, KEY }, accessToken } = require('./config');

const ENV = process.env.NODE_ENV;
if (!ENV) {
  throw new Error('不存在env');
}

// 安装包名字
const product_name = yaml.parse(fs.readFileSync(path.resolve(__dirname, `../yml/${ENV}.yml`), 'utf8')).productName;

// 安装包的路径
const PATH_ENV_MAP = {
  production: 'dist',
  staging: 'dist_staging',
  dev: 'dist_dev',
  test: 'dist_test',
};
const PREFIX_PATH = `./${PATH_ENV_MAP[ENV]}/`;

const ENV_KEY = `${KEY}${env}/`;

// 七牛ak sk bucket
const CONFIG = require('../config/qiniu.json');

const mac = new qiniu.auth.digest.Mac(CONFIG.ak, CONFIG.sk);
const config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z0;
config.useHttpsDomain = true;
config.useCdnDomain = true;
const form_upload = new qiniu.form_up.FormUploader(config);
const put_extra = new qiniu.form_up.PutExtra();
const cdn_manager = new qiniu.cdn.CdnManager(mac);

function generate_path(file_name) {
  return path.join(__dirname, `${PREFIX_PATH}`, file_name);
}

function upload_file(file_name) {
  const file_path = generate_path(file_name);
  const upload_token = new qiniu.rs.PutPolicy({scope: `${CONFIG.bucket}:${ENV_KEY}${file_name}`}).uploadToken(mac);
  console.log('上传文件中');
  form_upload.putFile(upload_token, `${ENV_KEY}${file_name}`, file_path, put_extra, function(err, res, res_info) {
    if (err) {
      throw err;
    }
    if (res_info.statusCode == 200) {
      const url = `${PREFIX_URL}/${res_info.data.key}`;
      console.log('上传文件成功');
      refresh_file(url)
    } else {
    }
  });
}

// 刷新七牛缓存
function refresh_file(url) {
  console.log('刷新文件中');
  cdn_manager.refreshUrls([url], function(err, respBody, respInfo) {
    if (err) {
      throw err;
    }
    if (respInfo.statusCode == 200) {
      console.log('刷新文件完成');
      send_to_dingtalk(url);
    }
  });
}

function send_to_dingtalk(url) {
  const options = {
    host: 'oapi.dingtalk.com',
    path: `/robot/send?access_token=${accessToken}`,
    port: 443,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
  };
  const data = {
    msgtype: 'text', 
    text: {
        'content': `客户端版本${version}下载地址${url}`
    }, 
  }
  const req = https.request(options);
	req.write(JSON.stringify(data));
  req.end();
}

let files;
if (platform == 'darwin') {
  files = [`${product_name}-${version}-mac.zip`, `${product_name}-${version}.dmg`];
} else if (platform == 'win32') {
  files = [`${product_name} Setup ${version}.exe`];
}
try {
  files.map((item) => {
    upload_file(item);
  });
} catch (error) {
  console.log(error);
}