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

// Adiciona handler IPC para disponibilizar o CSV para o frontend
const csvFilePath = app.isPackaged
  ? path.join(process.resourcesPath, 'python', 'dados_sensores.csv')
  : path.join(__dirname, '../../python/dados_sensores.csv');

const jsonFilePath = app.isPackaged
  ? path.join(process.resourcesPath, 'python', 'dados_paciente.json')
  : path.join(__dirname, '../../python/dados_paciente.json');

// Leitura do CSV e JSON de forma assíncrona
ipcMain.handle('get-csv-data', async () => {
  try {
    const data = await fs.promises.readFile(csvFilePath, 'utf-8');
    return data;
  } catch (error) {
    console.error("Erro ao ler o arquivo CSV:", error);
    throw error;
  }
});

ipcMain.handle('get-json-data', async () => {
  try {
    const data = await fs.promises.readFile(jsonFilePath, 'utf-8');
    return data;
  } catch (error) {
    console.error("Erro ao ler o arquivo JSON:", error);
    throw error;
  }
});

// Watchers para monitorar alterações no CSV e JSON
const watcherCsv = chokidar.watch(csvFilePath);
const watcherJson = chokidar.watch(jsonFilePath);

watcherCsv.on('change', (path) => {
  console.log(`Arquivo ${path} foi modificado.`);
  mainWindow?.webContents.send('csv-updated');
});

watcherJson.on('change', (path) => {
  console.log(`Arquivo ${path} foi modificado.`);
  mainWindow?.webContents.send('json-updated');
});

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

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

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

  // Atualizações automáticas
  new AppUpdater();

  // Executa o programa .exe dependendo do ambiente
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
    exeProcess.kill();  // Encerra o processo .exe se ainda estiver em execução
    exeProcess = null;   // Limpa a referência ao processo
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (exeProcess) {
    exeProcess.kill();  // Garante que o .exe será encerrado antes do app sair
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
