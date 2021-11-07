const { app, BrowserWindow } = require('electron');
const path = require('path');

// modify your existing createWindow() function
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (process.env.NODE_ENV === 'production') {
    // load static production build
    win.loadFile(path.join(__dirname, '../client/build/index.html'));
  } else {
    // load dev server
    win.loadURL('http://localhost:3000');
  }
}

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', function () {
  // For now, we just quit the app when the window is closed even on macOS
  // if (process.platform !== 'darwin') app.quit()
});

// app.whenReady().then(() => {
//   createWindow()

//   app.on('activate', function () {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow()
//   })
// })
