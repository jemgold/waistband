/* eslint-disable no-console */
/* @flow */
const { cond, propEq, T } = require('ramda');
const url = require('url');
const path = require('path');
const Future = require('fluture');
const menubar = require('menubar');
const { dialog, ipcMain } = require('electron'); // eslint-disable-line import/no-extraneous-dependencies
require('electron-debug')({ showDevTools: true });
const isDev = require('electron-is-dev');
const { describeInstances, startInstances, stopInstances } = require('./ec2');
const { runningInstanceCost } = require('./src/shared/ec2Utils');

const startUrl = process.env.ELECTRON_START_URL || url.format({
  pathname: path.join(__dirname, '/../build/index.html'),
  protocol: 'file:',
  slashes: true,
});

const menu = menubar({
  index: startUrl,
  alwaysOnTop: true,
  resizable: false,
  width: 480,
  height: 416,
  windowPosition: 'trayRight',
});

menu.on('ready', () => {
  console.log('ready!');

  let Reservations = null;

  describeInstances({
    DryRun: false,
  }).fork(
    err => dialog.showErrorBox('Couldn’t connect to AWS 😭', err.message),
    (res) => {
      Reservations = res;
      if (menu.window) {
        menu.window.webContents.send('updateInstances', Reservations);
      }

      const title = `$${runningInstanceCost(res).toFixed(2)}`;
      menu.tray.setTitle(title);
    },
  );

  menu.on('show', () => {
    if (Reservations) {
      menu.window.webContents.send('updateInstances', Reservations);
    }
  });

  const isStart = propEq('start');
  const isStop = propEq('stop');

  ipcMain.on('task', (event, task) => {
    cond([
      [isStart, t => startInstances({ DryRun: isDev, InstanceIds: [t.id] })],
      [isStop, t => stopInstances({ DryRun: isDev, InstanceIds: [t.id] })],
      [T, () => Future.reject('invalid task')],
    ])(task)
    .fork(
      err => dialog.showErrorBox('Something went wrong', err.message),
      res => console.log(res),
    );
  });
});
