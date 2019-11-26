const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV;
const OS = process.env.OS;
const cfg = require(`../config/${env}.json`);
cfg.os = OS;
const mainConfigPath = path.resolve(__dirname, '../src/main-process/config') ;
try {
  fs.accessSync(mainConfigPath);
} catch (error) {
  fs.mkdirSync(mainConfigPath);
}
fs.writeFileSync(`${mainConfigPath}/cfg.json`, JSON.stringify(cfg));