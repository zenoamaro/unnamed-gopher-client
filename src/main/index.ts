import 'v8-compile-cache';
import {app, protocol, BrowserWindow, ipcMain} from 'electron';
import {gopherProtocolScheme, gopherProtocolHandler} from 'protocols/gopher';
import * as Core from 'core';

let window: BrowserWindow;

function createWindow() {
  window = new BrowserWindow({
    width: 1300,
    height: 800,
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  window.webContents.on('new-window', (event, url, frame, disposition, options) => {
    const at = (frame != null && frame != '') ? Number(frame) : undefined;
    const mode = (at != null && disposition === 'foreground-tab') ? 'push' : disposition;
    const visited = Core.visit(url, mode, at);
    if (visited) event.preventDefault();
  });

  window.webContents.on('will-navigate', (event, url) => {
    const visited = Core.visit(url, 'push');
    if (visited) event.preventDefault();
  });

  Core.subscribe((state) => {
    window.webContents.send('state', state);
  });

  ipcMain.on('state', (event) => {
    Core.withState((state) => {
      event.sender.send('state', state);
    });
  });

  ipcMain.on('action', async (event, action: keyof typeof Core, ...args: any[]) => {
    // @ts-ignore
    await Core[action](...args);
  });

  window.loadFile(`build/app.html`);
}

protocol.registerSchemesAsPrivileged([
  gopherProtocolScheme,
]);

// FIXME MacOS-only
// FIXME Needs to wait for app to be ready
app.on('open-url', (e, url) => {
  window?.webContents.send('deep-link', url);
});

app.whenReady()
  .then(createWindow)
  .then(() => protocol.registerStreamProtocol(gopherProtocolScheme.scheme, gopherProtocolHandler))

