import {app, BrowserWindow} from 'electron';
import installExtension, {REACT_DEVELOPER_TOOLS} from 'electron-devtools-installer';

let win: BrowserWindow;

function createWindow() {
  win = new BrowserWindow({
    width: 1300,
    height: 800,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true,
    }
  });

  win.loadFile(`build/app.html`);
}

// FIXME MacOS-only
// FIXME Needs to wait for app to be ready
app.on('open-url', (e, url) => {
  win?.webContents.send('deep-link', url);
});

app.whenReady()
  .then(createWindow)
  .then(() => installExtension(REACT_DEVELOPER_TOOLS));
