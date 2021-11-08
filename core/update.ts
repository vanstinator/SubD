import { app, autoUpdater, dialog } from 'electron';
// const logger = require('electron-log');
import os from 'os';

// const log = logger.scope('updater');

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version has been downloaded. Restart the application to apply the updates.'
  };

  dialog.showMessageBox(dialogOpts).then(returnValue => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall();
  });
});

export default function registerUpdater() {
  console.log('register update');
  try {
    const server = 'https://downloads.subdazzle.com';

    // We don't support arm builds for win or mac... yet 😈
    let arch = os.arch();
    if (arch === 'arm64' || arch === 'aarch64') {
      arch = 'x64';
    }

    let updateUrl;
    if (process.platform === 'win32') {
      updateUrl = `${server}/update/win32/${app.getVersion()}`;
    } else if (process.platform === 'darwin') {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      updateUrl = `${server}/update/${os.platform()}_${os.arch()}/${app.getVersion()}/`;
    }
    // @ts-ignore TODO fix type issue here
    autoUpdater.setFeedURL({ url: updateUrl });
    autoUpdater.checkForUpdates();

    setInterval(() => {
      autoUpdater.checkForUpdates();
    }, 60 * 1000 * 10); // every 10 minutes
  } catch (e) {
    // log.error('there was a problem registering the updater. bailing out.', e);
  }
}
