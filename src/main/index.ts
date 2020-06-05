import 'v8-compile-cache';
import {app, protocol, BrowserWindow} from 'electron';
import installExtension, {REACT_DEVELOPER_TOOLS} from 'electron-devtools-installer';
import {gopherProtocolScheme, gopherProtocolHandler} from 'protocols/gopher';


let win: BrowserWindow;

function createWindow() {
  win = new BrowserWindow({
    width: 1300,
    height: 800,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile(`build/app.html`);
}

protocol.registerSchemesAsPrivileged([
  gopherProtocolScheme,
]);

// FIXME MacOS-only
// FIXME Needs to wait for app to be ready
app.on('open-url', (e, url) => {
  win?.webContents.send('deep-link', url);
});

app.whenReady()
  .then(createWindow)
  .then(() => protocol.registerStreamProtocol(gopherProtocolScheme.scheme, gopherProtocolHandler))
  .then(() => installExtension(REACT_DEVELOPER_TOOLS))
