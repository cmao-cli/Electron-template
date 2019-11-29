const rl = require('readline');
const platform = require('os').platform();
const child_process = require('child_process');
const path = require('path');
const { build: { MAC_CSC_LINK, WIN_CSC_LINK, CSC_KEY_PASSWORD } } = require('./config')

function creat_rl(prompt) {
  const rl_ins = rl.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt,
  });
  rl_ins.prompt();
  return rl_ins;
}

const OS = platform === 'darwin' ? 'mac' : 'win';

const ENV_MAP = ['production', 'staging', 'test', 'dev'];

const env_rl = creat_rl('想要打什么环境的包:(production, staging, test, dev)');

env_rl.on('line', function(env) {
  env_rl.close();
  if (ENV_MAP.indexOf(env) === -1) {
    console.error('不存在当前环境')
    return;
  }
  const action_rl = creat_rl('想要的操作是打包(build)？自动更新起效(update)？）');
  action_rl.on('line', function(line) {
    action_rl.close();
    if (line === 'build') {
      build(env);
    } else if (line === 'update') {
      update(env);
    } else {
      console.error('未知操作');
    }
  });
});

function build(env) {
  const buildCfgPath = path.resolve(__dirname, `../yml/${env}.yml`);
  const configPath = path.resolve(__dirname, './cfg.js');
  const uploadPath = path.resolve(__dirname, './upload.js');
  console.log('正在重写配置');
  child_process.execSync(`cross-env NODE_ENV=${env} platform=${OS} node ${configPath}`, {stdio: 'inherit'});
  console.log('重写配置成功');
  console.log('正在打包');
  let cmd = `cross-env CSC_LINK=${MAC_CSC_LINK} CSC_KEY_PASSWORD=${CSC_KEY_PASSWORD} CSC_IDENTITY_AUTO_DISCOVERY=true npx electron-builder --config ${buildCfgPath}`;
  if (OS === 'win') {
    cmd = `cross-env npx electron-builder --win --x64 --ia32 --config ${buildCfgPath}`;
    if (env === 'production') {
      cmd = `cross-env CSC_LINK=${WIN_CSC_LINK} CSC_KEY_PASSWORD='' electron-builder --win --x64 --ia32 --config ${buildCfgPath}`;
    }
  }
  child_process.execSync(cmd, {stdio: 'inherit'});
  console.log('打包完成');
  const is_upload_rl = creat_rl('是否上传到七牛:(Y|N)');
  is_upload_rl.on('line', (line) => {
    is_upload_rl.close();
    if (!(/^Y(es)?$/i.test(line))) {
      console.log('不上传到七牛');
      return ;
    }
    console.log('正在上传');
    child_process.execSync(`cross-env NODE_ENV=${env} node ${uploadPath}`, {stdio: 'inherit'});
    console.log('上传完成');
  });
}

function update(env) {
  const updatePath = path.resolve(__dirname, './update.js');
  child_process.execSync(`cross-env NODE_ENV=${env} node ${updatePath}`,  {stdio: 'inherit'});
  console.log('更新完成');
}