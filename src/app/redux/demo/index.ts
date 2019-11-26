import { createModel, Raw, Action } from 'rdx-model';
// example
// states
export interface IDemoState {
  num:number;
}
// initial states
export const defaultState:IDemoState = {
  num: 0,
};
// Action && Reducer
export const demo = createModel({
  state: defaultState,
  reducers: {
    'demo/add': {
      name: Raw('addNum'),
      reducer: (state, action:Action<number>) : IDemoState => {
        const temp = state.num + action.payload!;
        // console.log(temp);
        return { ...state, num: temp };
      },
    },
    'demo/minus': {
      name: Raw('minusNum'),
      reducer: (state, action:Action<number>) : IDemoState => {
        const temp = state.num - action.payload!;
        return { ...state, num: temp };
      },
    },
  },
});

export const { addNum, minusNum } = demo.actions;