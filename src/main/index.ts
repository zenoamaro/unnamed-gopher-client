import {app, BrowserWindow} from 'electron';
import installExtension, {REACT_DEVELOPER_TOOLS} from 'electron-devtools-installer';

function createWindow() {
  let win = new BrowserWindow({
    width: 1300,
    height: 800,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true,
    }
  });

  win.loadFile('./app.html')
}

app.whenReady()
  .then(createWindow)
  .then(() => installExtension(REACT_DEVELOPER_TOOLS));
