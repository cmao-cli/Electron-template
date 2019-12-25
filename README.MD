### 项目目录结构

```js
.
├── build // 渲染进程build后的静态资源文件
├── dist-dev // 发包后的文件
├── config // 主进程里面不同环境用到的config文件
│   ├── dev.json
│   └── qiniu.json
├── js_transition.d.ts
├── mlz-pack.js
├── package-lock.json
├── package.json
├── scripts
│   ├── build.js  // 不同平台和不同环境发包调用的文件
│   ├── cfg.jm. // 生成不同环境的主进程config到./src/main-process/config下
│   ├── update.js 
│   └── upload.js //上传打包后的应用到七牛云，然后发送通知到钉钉
├── src
│   ├── app // 渲染进程源码
│   │   ├── api
│   │   ├── commons
│   │   ├── components
│   │   ├── index.ejs
│   │   ├── index.tsx
│   │   ├── pages
│   │   ├── redux
│   │   └── utils
│   └── main-process // 主进程源码
│       ├── app-updater.js
│       ├── config
│       └── main.js
├── tsconfig.json
└── yml // 用于eletron-builder不同环境的config
    ├── dev.yml
    ├── production.yml
    ├── staging.yml
    └── test.yml
```

### 开发之前初始化项目配置(很重要)
[官网地址](https://www.electron.build/configuration/configuration)
1. `yml/dev.yml`
需要配置yml/dev.yml中以下空项，并且在yml文件夹下创建不同环境的配置
```js
publish:
- provider: generic
  url: 该地址上传发包后的应用描述文件latest.yml,用于自动更新
appId: 
productName: 
asar: false
win:
  publisherName: 
  rfc3161TimeStampServer:
  timeStampServer: 
linux:
  category: Education
files:
- "node_modules/**"
- "build/**"
- "src/**"
- "!src/app"
directories:
  output: dist-dev
```

2. `config/qiniu.json`
配置打包后七牛上传的ak sk，用于脚本scripts/upload.js

3. `scripts/update.js`
配置update函数，该函数为自己项目中应用版本信息更新的逻辑

### 开发
执行：`npm run start`
npm run start会同时启动渲染进程和主进程。
执行：`npm run watch`
需要先修改start-main-dev命令中wait-on监听的端口为项目端口。
启动项目的同时监听electron文件内容变化。
```js
"start": "cross-env NODE_ENV=development npm run start-renderer-dev & npm run start-main-dev",
"start-main-dev": "cross-env NODE_ENV=development electron ./src/main-process/main.js",
"start-renderer-dev": "cross-env NODE_ENV=development yuumi serve ./src/app/index.tsx",
```

### 发包
package发包不同环境和不同平台的包
先会打包渲染进程的静态文件，然后执行`./scripts/build.js`脚本选择环境进行打包
`"package": "npm run build-renderer && node ./scripts/build.js","`


### 自动更新流程
在渲染进程初始化的时候中发起`detect_update`的消息到主进程中
主进程监听到detect_update的消息后调用`checkForUpdates`, 查询服务器是否需要更新
如果有检测到需要更新 发送消息给渲染进程
```js
function sendStatusToWindow(text) {
  global.win.webContents.send('update_message', text);
}
```
当检测到更新后主进程`update_available`的消息给渲染进程，渲染进程收到之后展示对应的更新提示，然后当触发更新`start_update`之后调用`autoUpdater.downloadUpdate()`开始更新。
更新事件会在不同阶段触发不同的事件，渲染进程收到不同的消息后做对应的响应
更新完成之后会关闭掉当前的应用，重新安装
```js
autoUpdater.on('error', (ev, err) => {
  sendStatusToWindow('error');
  log(JSON.stringify({
    type: 'update_error',
    error: err,
    event: ev,
  }), 'ERROR');
});
autoUpdater.on('download-progress', (ev, progressObj) => {
  sendStatusToWindow('downloading');
})
autoUpdater.on('update-downloaded', (ev, info) => {
  sendStatusToWindow('installing');
  setTimeout(function() {
    autoUpdater.quitAndInstall();  
  }, 1000)
```


