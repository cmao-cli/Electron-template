import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IReduxState } from '../../redux/root-reducer';
import { IDemoState, addNum, minusNum } from '../../redux/demo';
import * as cx from 'classnames';

import { remote, ipcRenderer  } from 'electron';
const { shell } = remote;

import './index.scss';

interface IIndexProps {
  demoState:IDemoState;
  addNum:typeof addNum;
  minusNum:typeof minusNum;
}


class Index extends React.PureComponent<IIndexProps> {
  openBrowser() {
    //打开默认浏览器
    shell.openExternal('http://www.baidu.com');
    
    // send方法发送的消息会被electron序列化，方法和原型会被去掉
    ipcRenderer.send('echo', {
      name: 'luoqian',
      age: 23,
      say: () => {
        console.log('my name is luoqian');
      }
    });
  }
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
          <a target="_blank" href={'http://www.baidu.com'}>打开新窗口</a>
          <a href="javascript:(void 0)" onClick={() => { this.openBrowser() }}>打开浏览器窗口</a>
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