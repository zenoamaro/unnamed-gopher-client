import {app, BrowserWindow} from 'electron';

function createWindow() {
  let win = new BrowserWindow({
    width: 1336,
    height: 768,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true,
    }
  });

  win.loadFile('./index.html')
}

app.whenReady().then(createWindow);
