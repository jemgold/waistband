/* eslint-disable no-console */
/* @flow */
const { compose, cond, filter, length, propEq, T } = require('ramda');
const { Future } = require('ramda-fantasy');
const menubar = require('menubar');
const { dialog, ipcMain } = require('electron');
const { describeInstances, startInstances, stopInstances } = require('./ec2');
const { START_INSTANCE } = require('./constants');
const { runningInstanceCost } = require('./src/shared/ec2Utils');

const startUrl = process.env.ELECTRON_START_URL || url.format({
  pathname: path.join(__dirname, '/../build/index.html'),
  protocol: 'file:',
  slashes: true,
});

const menu = menubar({
  index: startUrl,
  alwaysOnTop: true,
  width: 480,
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
      menu.window.webContents.send('updateInstances', Reservations)
    }
  });

  const isStart = propEq('start');
  const isStop = propEq('stop');

  ipcMain.on('task', (event, task) => {
    cond([
      [isStart, t => startInstances({ DryRun: true, InstanceIds: [t.id] })],
      [isStop,  t => stopInstances({ DryRun: true, InstanceIds: [t.id] })],
      [T, () => Future.reject('invalid task')],
    ])(task)
    .fork(
      err => dialog.showErrorBox('Something went wrong', err.message),
      res => console.log(res),
    );
  });
});
