import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { append, compose, reverse, sortBy } from 'ramda';
import { getAllInstances, isRunning } from './shared/ec2Utils';

const electron = window.require('electron');
window.electron = electron;
const ipcRenderer = electron.ipcRenderer;
window.ipcRenderer = ipcRenderer


const fakeInstance = {
  State: {
    Name: 'running',
  },
  PublicIpAddress: '52.36.0.124',
  InstanceType: 't2.micro',
  InstanceId: 'i-12344123',
};

ipcRenderer.on('updateInstances', (event, args) => {
  render(compose(reverse, sortBy(isRunning), append(fakeInstance), getAllInstances)(args));
})

const render = instances =>
  ReactDOM.render(
    <App instances={instances} />,
    document.getElementById('root')
  );
