import React, { PropTypes } from 'react';
import { getPrice } from './shared/ec2Utils';
import { Instance as InstanceS } from './Shapes';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
const start = id =>
  ipcRenderer.send('task', { task: 'start', id });

const Button = props =>
  <button
    onClick={props.onClick}
    className="f6 input-reset br2 bn ph3 pv2 mb2 dib bg-black white outline-0 ttu tracked"
  >
    { props.children }
  </button>;

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.string.isRequired,
};

const Instance = props =>
  <div className={`sans-serif ${props.State.Name === 'stopped' ? 'mid-gray' : 'bg-light-green dark-green'} flex items-center lh-copy pa3 ph0-l bb b--black-10`}>
    <div className="pl3 flex-auto">
      <span className="b f4 db">
        { props.PublicIpAddress }
      </span>
      <span className="f6 db">
        { props.InstanceType } { `$${getPrice(props).toFixed(2)}/h` }
      </span>
      <span className="f6 db">
        { props.InstanceId }
      </span>
    </div>
    <div>
      <Button onClick={() => start(props.InstanceId)}>
        { props.State.Name }
      </Button>
    </div>
  </div>;

Instance.propTypes = InstanceS;

export default Instance;
