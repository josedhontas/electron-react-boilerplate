import path from 'path';
import fs from 'fs';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import chokidar from 'chokidar';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let exeProcess: ChildProcessWithoutNullStreams | null = null;

// Caminhos para os arquivos
const csvFilePath = app.isPackaged
  ? path.join(process.resourcesPath, 'python', 'dados_sensores.csv')
  : path.join(__dirname, '../../python/dados_sensores.csv');

const jsonFilePath = app.isPackaged
  ? path.join(process.resourcesPath, 'python', 'dados_paciente.json')
  : path.join(__dirname, '../../python/dados_paciente.json');

const jsonSensorPath = app.isPackaged
  ? path.join(process.resourcesPath, 'python', 'dados_sensores.json')
  : path.join(__dirname, '../../python/dados_sensores.json');

// Handlers IPC
ipcMain.handle('get-csv-data', async () => {
  try {
    const data = await fs.promises.readFile(csvFilePath, 'utf-8');
    return data;
  } catch (error) {
    console.error('Erro ao ler o arquivo CSV:', error);
    throw error;
  }
});

ipcMain.handle('get-json-paciente', async () => {
  try {
    const data = await fs.promises.readFile(jsonFilePath, 'utf-8');
    return data;
  } catch (error) {
    console.error('Erro ao ler o arquivo JSON de paciente:', error);
    throw error;
  }
});

ipcMain.handle('get-json-sensor', async () => {
  try {
    const data = await fs.promises.readFile(jsonSensorPath, 'utf-8');
    return data;
  } catch (error) {
    console.error('Erro ao ler o arquivo JSON de sensores:', error);
    throw error;
  }
});

// Watchers para monitorar alterações nos arquivos
const watcherCsv = chokidar.watch(csvFilePath);
const watcherJsonPaciente = chokidar.watch(jsonFilePath);
const watcherJsonSensor = chokidar.watch(jsonSensorPath);

watcherCsv.on('change', () => {
  console.log(`Arquivo CSV (${csvFilePath}) foi modificado.`);
  mainWindow?.webContents.send('csv-updated');
});

watcherJsonPaciente.on('change', () => {
  console.log(`Arquivo JSON de paciente (${jsonFilePath}) foi modificado.`);
  mainWindow?.webContents.send('json-paciente-updated');
});

watcherJsonSensor.on('change', () => {
  console.log(`Arquivo JSON de sensores (${jsonSensorPath}) foi modificado.`);
  mainWindow?.webContents.send('json-sensor-updated');
});

// Configurações principais do Electron
if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string =>
    path.join(RESOURCES_PATH, ...paths);

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  new AppUpdater();

  const exePath = app.isPackaged
    ? path.join(process.resourcesPath, 'python', 'main.exe')
    : path.join(__dirname, '../../python/main.exe');

  exeProcess = spawn(exePath, [], {
    cwd: path.dirname(exePath),
    env: process.env,
  });

  exeProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
};

/**
 * Eventos do app
 */
app.on('window-all-closed', () => {
  if (exeProcess) {
    exeProcess.kill();
    exeProcess = null;
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (exeProcess) {
    exeProcess.kill();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
