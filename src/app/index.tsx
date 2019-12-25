import * as React from 'react';
import { Provider } from 'react-redux';
import * as ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { _createStore } from './redux/root-store';
import { Switch, Route } from 'react-router';
import { routes } from './pages/router';
import * as iris from '@cmao/iris'
import { tigerApi } from './api/index';
/* tslint:disable-next-line */
require('./commons/css/style.scss');

// tigerApi.post('/tiger/v3/web/accounts/login', {
//   identity: '15019482307',
//   password: 'abc123',
//   pid: 'Q5AMeOXz'
// })

// const request:XMLHttpRequest|null = new XMLHttpRequest();
// request.open('POST', 'https://backend-dev.codemao.cn/tiger/v3/web/accounts/login', true);
// request.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
// request.send(
//   JSON.stringify({
//     identity: '15019482307',
//     password: 'abc123',
//     pid: 'Q5AMeOXz'
//   })
// )
iris.init({
  env: 'dev'
})
const CodemaoAuth = iris.auth.init({ 
  // 产品id
  pid:'123',
  // 产品代号，用于数据平台分析
  product_code:'3213',
  // 平台，当前业务的适用平台，用于数据平台分析
  platform:'web',
});
CodemaoAuth.login_account("15019482307","abc123","Q5AMeOXz");



console.log('index.tsx run');
React
const store = _createStore();
const rootElement = document.getElementById('root');
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <HashRouter>
        <Switch>
          {
            routes.map((val, key) => <Route {...val} key={`route_${key}`}/>)
          }
        </Switch>
      </HashRouter>
    </Provider>
  </React.StrictMode>,
  rootElement,
);