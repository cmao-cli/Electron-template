/**
 * @summary 更改pc客户端版本号和下载地址
 *
 */
const version = require('../package.json').version;
const platform = require('os').platform();
const axios = require('axios');
const qiniu = require('qiniu');
const CONFIG = require('../config/qiniu.json');
const path = require('path');
const { qiniu: { PREFIX_URL, KEY }, tigerHost } = require('./config');
let file = '';

const env = process.env.NODE_ENV;
if (!env) {
  throw new Error('不存在env');
}

// 上传的地址
const ENV_KEY = `${KEY}${env}/`;

const ENV_MAP = {
  production: 'dist',
  staging: 'dist_staging',
  dev: 'dist_dev',
  test: 'dist_test',
};
const PREFIX_PATH = `./${ENV_MAP[env]}/`;

let host = tigerHost[env];

const mac = new qiniu.auth.digest.Mac(CONFIG.ak, CONFIG.sk);
const config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z0;
config.useHttpsDomain = true;
config.useCdnDomain = true;
const form_upload = new qiniu.form_up.FormUploader(config);
const put_extra = new qiniu.form_up.PutExtra();
const cdn_manager = new qiniu.cdn.CdnManager(mac);

function upload_file(file_name) {
  const file_path = generate_path(file_name);
  const upload_token = new qiniu.rs.PutPolicy({scope: `${CONFIG.bucket}:${ENV_KEY}${file_name}`}).uploadToken(mac);
  form_upload.putFile(upload_token, `${ENV_KEY}${file_name}`, file_path, put_extra, function(err, res, res_info) {
    if (err) {
      throw err;
    }
    if (res_info.statusCode == 200) {
      console.log(`${PREFIX_URL}/${res_info.data.key}`);
      refresh_file(`${PREFIX_URL}/${res_info.data.key}`);
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
      update();
    }
  });
}

function generate_path(file_name) {
  return path.join(__dirname, `${PREFIX_PATH}`, file_name);
}

if (env !== 'production') {
  if (platform == 'darwin') {
    file = `latest-mac.yml`;
  } else if (platform == 'win32') {
    file = `latest.yml`;
  }
}

if (!file) {
  throw new Error('file不存在');
}

upload_file(file)

/**
 * 更新对外暴露的应用版本信息接口
 */
function update() {
  console.log('请编写自己项目的更新接口和更新逻辑');
}