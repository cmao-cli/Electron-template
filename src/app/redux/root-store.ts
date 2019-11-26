import {  createStore, applyMiddleware, Middleware, Store } from 'redux';
import { rootReducer, IReduxState } from './root-reducer';
import createSagaMiddleware from 'redux-saga';
import { rootSaga } from './root-saga';

export type StoreType = Store<IReduxState>;

// 创建 saga middleware
const sagaMiddleware = createSagaMiddleware({
  onError: (error:Error) => {
    // 捕获sagas中未被捕获的错误
    console.log('error is', error);
  },
});

export let _createStore =  () : Store<IReduxState> => {
  const middlewares:Middleware[] = [sagaMiddleware].filter(Boolean);

  // 注入 saga middleware
  const createStoreWithMidddleware = applyMiddleware(
    ...middlewares,
  )(createStore);

  const stateStore:any = createStoreWithMidddleware(
    rootReducer,
    (window as any).__REDUX_DEVTOOLS_EXTENSION__
      && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
  );
  return stateStore;
};
export const store = _createStore();
sagaMiddleware.run(rootSaga);