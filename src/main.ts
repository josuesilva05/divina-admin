/// <reference path="./types.d.ts" />
import { app, BrowserWindow, dialog } from 'electron'
import registerListeners from './helpers/ipc/listeners-register'
// Adiciona suporte automático para atalhos durante instalação/atualização
import started from 'electron-squirrel-startup'
import path from 'path'
import fs from 'fs'
import {
  installExtension,
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer'
import { runMigrations } from './database/seeder'
import { initDatabase } from './database/database'

// Função para criar logger em arquivo
function createLogger() {
  const isDev = process.env.NODE_ENV === 'development'
  if (isDev) return console // Em desenvolvimento, usar console normal
  
  const logPath = path.join(app.getPath('userData'), 'app.log')
  
  const logToFile = (level: string, ...args: any[]) => {
    const timestamp = new Date().toISOString()
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ')
    const logEntry = `[${timestamp}] ${level.toUpperCase()}: ${message}\n`
    
    try {
      fs.appendFileSync(logPath, logEntry)
    } catch (e) {
      // Se não conseguir escrever no log, pelo menos tente mostrar um diálogo
      dialog.showErrorBox('Erro de Log', `Não foi possível escrever no arquivo de log: ${e}`)
    }
  }
  
  return {
    log: (...args: any[]) => logToFile('info', ...args),
    error: (...args: any[]) => {
      logToFile('error', ...args)
      // Para erros críticos, mostrar também um diálogo
      const errorMsg = args.map(arg => String(arg)).join(' ')
      dialog.showErrorBox('Erro da Aplicação', `${errorMsg}\n\nVer log completo em: ${logPath}`)
    },
    warn: (...args: any[]) => logToFile('warn', ...args),
    info: (...args: any[]) => logToFile('info', ...args)
  }
}

// Substituir console global em produção
const logger = createLogger()

// Interceptar erros não capturados
process.on('uncaughtException', (error) => {
  logger.error('UNCAUGHT EXCEPTION:', error.stack || error.message)
  dialog.showErrorBox(
    'Erro Fatal', 
    `Erro não capturado:\n${error.message}\n\nO aplicativo será fechado.\n\nLog salvo em: ${app.getPath('userData')}/app.log`
  )
  app.quit()
})

process.on('unhandledRejection', (reason, promise) => {
  logger.error('UNHANDLED REJECTION:', reason)
  dialog.showErrorBox(
    'Erro de Promise', 
    `Promise rejeitada:\n${reason}\n\nLog salvo em: ${app.getPath('userData')}/app.log`
  )
})

// Declarações para as variáveis do Vite/Forge
declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string
declare const MAIN_WINDOW_VITE_NAME: string

// Se está sendo executado pelo Squirrel (instalação/atualização), sai imediatamente
if (started) app.quit()

// Função para lidar com eventos do Squirrel manualmente (alternativa ao electron-squirrel-startup)
function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command: string, args: string[]) {
    let spawnedProcess;
    try {
      spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
    } catch (error) {
      console.error('Spawn error:', error);
    }
    return spawnedProcess;
  };

  const spawnUpdate = function(args: string[]) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Criar atalhos na área de trabalho e menu iniciar
      spawnUpdate(['--createShortcut', exeName]);
      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Remover atalhos da área de trabalho e menu iniciar
      spawnUpdate(['--removeShortcut', exeName]);
      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      app.quit();
      return true;
  }
  return false;
}

// Usar o método manual se preferir controle total (descomente as linhas abaixo e comente o electron-squirrel-startup)
// if (handleSquirrelEvent()) {
//   return;
// }

const inDevelopment = process.env.NODE_ENV === "development";

function createWindow() {
  const preload = path.join(__dirname, "preload.js");
  const mainWindow = new BrowserWindow({
    width: 1500,
    height: 900,
    webPreferences: {
      devTools: inDevelopment,
      contextIsolation: true,
      nodeIntegration: true,
      nodeIntegrationInSubFrames: false,

      preload: preload,
    },
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "hidden",
    trafficLightPosition: process.platform === "darwin" ? { x: 5, y: 5 } : undefined,
  });
  registerListeners(mainWindow);

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
}

async function installExtensions() {
  try {
    const result = await installExtension(REACT_DEVELOPER_TOOLS);
    logger.info(`Extensions installed successfully: ${result.name}`);
  } catch (error) {
    logger.error("Failed to install extensions:", error);
  }
}

app
  .whenReady()
  .then(async () => {
    logger.info('=== INICIANDO APLICAÇÃO ===')
    logger.info('NODE_ENV:', process.env.NODE_ENV)
    logger.info('App Path:', app.getAppPath())
    logger.info('Resources Path:', process.resourcesPath)
    logger.info('User Data Path:', app.getPath('userData'))
    
    try {
      logger.info('Inicializando banco de dados...')
      await initDatabase()
      logger.info('Database initialized successfully')
      
      logger.info('Executando migrações...')
      runMigrations()
      logger.info('Migrations completed successfully')
      
      logger.info('Criando janela principal...')
      createWindow()
      logger.info('Aplicação iniciada com sucesso!')
      
    } catch (error) {
      logger.error('FATAL ERROR during initialization:', error)
      
      const errorMessage = error instanceof Error ? error.message : String(error)
      const stackTrace = error instanceof Error ? error.stack : 'No stack trace'
      
      logger.error('Error details:', {
        message: errorMessage,
        stack: stackTrace,
        appPath: app.getAppPath(),
        resourcesPath: process.resourcesPath,
        userDataPath: app.getPath('userData')
      })
      
      dialog.showErrorBox(
        'Erro de Inicialização', 
        `Falha ao inicializar o banco de dados:\n\n${errorMessage}\n\nDetalhes salvos em: ${app.getPath('userData')}/app.log\n\nO aplicativo será fechado.`
      )
      
      app.quit()
      return
    }
  })
  .then(() => {
    logger.info('Instalando extensões de desenvolvimento...')
    return installExtensions()
  })
  .catch((error) => {
    logger.error('Erro durante instalação de extensões:', error)
  })

// Definir App User Model ID para o Windows
app.setAppUserModelId("com.divinaglow.DivinaGlow.DivinaGlow");

//osX only
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
//osX only ends
