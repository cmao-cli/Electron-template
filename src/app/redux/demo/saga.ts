import { call } from 'redux-saga/effects';

export function* DemoSaga() {
  yield call(() => 'success');
}