import * as React from 'react';
import { Provider } from 'react-redux';
import * as ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { _createStore } from './redux/root-store';
import { Switch, Route } from 'react-router';
import { routes } from './pages/router';

/* tslint:disable-next-line */
require('./commons/css/style.scss');

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