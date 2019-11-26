import { combineReducers } from 'redux';
import { IDemoState, demo } from './demo/index';
export interface IReduxState {
  demo:IDemoState;
}

export const rootReducer = combineReducers<IReduxState>({
  demo:demo.reducer,
});