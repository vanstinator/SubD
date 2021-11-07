import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import registerUpdater from './update';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// modify your existing createWindow() function
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
    }
  });

  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // if (process.env.NODE_ENV === 'production') {
  //   // load static production build
  //   win.loadFile(path.join(__dirname, './html/index.html'));
  // } else {
  //   // load dev server
  //   win.loadURL('http://localhost:3000');
  // }
}
app.whenReady().then(() => {
  registerUpdater();
  createWindow();
});

app.on('window-all-closed', function () {
  // For now, we just quit the app when the window is closed even on macOS
  // if (process.platform !== 'darwin') app.quit()
  app.quit();
});

// app.whenReady().then(() => {
//   createWindow()

//   app.on('activate', function () {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow()
//   })
// })
