import * as React from 'react';
import { connect } from 'react-redux';
import * as cx from 'classnames';
import { bindActionCreators } from 'redux';

import { IReduxState } from '../../redux/root-reducer';
import { IDemoState, addNum, minusNum } from '../../redux/demo';
import './index.scss';

interface IIndexProps {
  demoState:IDemoState;
  addNum:typeof addNum;
  minusNum:typeof minusNum;
}

class Index extends React.PureComponent<IIndexProps> {
  private _divider = 2;
  render() {
    const { num } = this.props.demoState;
    return (
      <div>
        <h1>This is a demo.</h1>
        <div>
          <span styleName={cx('is_black', num % this._divider === 0 && 'is_red')}>{num}</span>
          <button onClick={() => {this.props.addNum(1); }}>+</button>
          <button onClick={() => {this.props.minusNum(1); }}>-</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state:IReduxState) => ({
  demoState: state.demo,
});
const mapDispatchToProps = (dispatch:any) => bindActionCreators({
  addNum,
  minusNum,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Index);