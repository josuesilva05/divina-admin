import initSqlJs from 'sql.js';
import path from 'path';
import { app, dialog } from 'electron';
import fs from 'fs';

const isDev = process.env.NODE_ENV === 'development';

// Logger personalizado para database
function createDatabaseLogger() {
  if (isDev) return console
  
  const logPath = path.join(app.getPath('userData'), 'database.log')
  
  const logToFile = (level: string, ...args: any[]) => {
    const timestamp = new Date().toISOString()
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ')
    const logEntry = `[${timestamp}] DB-${level.toUpperCase()}: ${message}\n`
    
    try {
      fs.appendFileSync(logPath, logEntry)
    } catch (e) {
      // Se não conseguir escrever no log, mostrar diálogo
      dialog.showErrorBox('Erro de Log Database', `${e}`)
    }
  }
  
  return {
    log: (...args: any[]) => logToFile('info', ...args),
    error: (...args: any[]) => logToFile('error', ...args),
    warn: (...args: any[]) => logToFile('warn', ...args),
    info: (...args: any[]) => logToFile('info', ...args)
  }
}

const dbLogger = createDatabaseLogger()

const dbPath = isDev
  ? path.resolve(process.cwd(), 'db.sqlite3')
  : path.join(app.getPath('userData'), 'db.sqlite3');

let db: any = null;

// Inicializar sql.js e carregar/criar banco de dados
export async function initDatabase() {
  try {
    dbLogger.info('=== INICIANDO INICIALIZAÇÃO DO BANCO ===')
    dbLogger.info('isDev:', isDev)
    dbLogger.info('dbPath:', dbPath)
    dbLogger.info('__dirname:', __dirname)
    dbLogger.info('process.cwd():', process.cwd())
    dbLogger.info('app.getAppPath():', app.getAppPath())
    dbLogger.info('process.resourcesPath:', process.resourcesPath)
    
    // Função para carregar sql.js de forma mais robusta
    async function loadSqlJs() {
      // Em desenvolvimento, usar o require normal
      if (isDev) {
        dbLogger.info('Modo desenvolvimento: usando require normal')
        const initSqlJs = require('sql.js')
        return initSqlJs
      }
      
      // Em produção, tentar diferentes estratégias
      dbLogger.info('Modo produção: tentando carregar sql.js...')
      
      const possibleSqlJsPaths = [
        // Tentativa 1: require normal (pode funcionar sem ASAR)
        'sql.js',
        
        // Tentativa 2: caminho absoluto para resources
        path.join(process.resourcesPath, 'sql.js', 'dist', 'sql-wasm.js'),
        path.join(process.resourcesPath, 'sql.js', 'lib', 'sql-wasm.js'),
        
        // Tentativa 3: caminho para app path
        path.join(app.getAppPath(), 'node_modules', 'sql.js'),
      ]
      
      for (const sqlPath of possibleSqlJsPaths) {
        try {
          dbLogger.info('Tentando carregar sql.js de:', sqlPath)
          
          if (sqlPath === 'sql.js') {
            // Require normal
            const initSqlJs = require('sql.js')
            dbLogger.info('✅ sql.js carregado via require normal')
            return initSqlJs
          } else {
            // Require com caminho absoluto
            if (fs.existsSync(sqlPath)) {
              const initSqlJs = require(sqlPath)
              dbLogger.info('✅ sql.js carregado de:', sqlPath)
              return initSqlJs
            } else {
              dbLogger.info('❌ Arquivo não encontrado:', sqlPath)
            }
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : String(error)
          dbLogger.error('❌ Erro ao carregar de:', sqlPath, errorMsg)
        }
      }
      
      throw new Error('Não foi possível carregar o módulo sql.js')
    }
    
    // Função para encontrar o arquivo WASM
    function findWasmPath(): string {
      const possiblePaths = [
        // Desenvolvimento
        path.join(__dirname, '../../node_modules/sql.js/dist/sql-wasm.wasm'),
        path.join(process.cwd(), 'node_modules/sql.js/dist/sql-wasm.wasm'),
        
        // Produção - recursos externos (extraResource)
        path.join(process.resourcesPath, 'sql.js', 'dist', 'sql-wasm.wasm'),
        path.join(process.resourcesPath, 'sql.js', 'lib', 'sql-wasm.wasm'),
        
        // Produção - múltiplas tentativas incluindo arquivos desempacotados
        path.join(process.resourcesPath, 'dist', 'sql-wasm.wasm'),
        path.join(process.resourcesPath, 'sql-wasm.wasm'),
        path.join(app.getAppPath(), 'dist', 'sql-wasm.wasm'),
        path.join(app.getAppPath(), 'sql-wasm.wasm'),
        path.join(app.getAppPath(), 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm'),
        path.join(__dirname, 'sql-wasm.wasm'),
        path.join(__dirname, '../sql-wasm.wasm'),
        path.join(__dirname, '../../sql-wasm.wasm'),
        path.join(__dirname, '../../../sql-wasm.wasm'),
        // Caminhos para arquivos desempacotados do ASAR
        path.join(app.getAppPath(), '..', 'app.asar.unpacked', 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm'),
        path.join(process.resourcesPath, 'app.asar.unpacked', 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm'),
      ];
      
      dbLogger.info(`Testando ${possiblePaths.length} caminhos possíveis para sql-wasm.wasm:`)
      
      for (const testPath of possiblePaths) {
        dbLogger.info('Testando caminho WASM:', testPath)
        
        // Em produção, salvar logs em arquivo
        if (!isDev) {
          try {
            const logPath = path.join(app.getPath('userData'), 'debug.log')
            const logMessage = `[${new Date().toISOString()}] Testando caminho WASM: ${testPath}\n`
            fs.appendFileSync(logPath, logMessage)
          } catch (e) {
            // Ignorar erros de log
          }
        }
        
        if (fs.existsSync(testPath)) {
          dbLogger.info('✅ Arquivo WASM encontrado em:', testPath)
          
          // Em produção, salvar logs em arquivo
          if (!isDev) {
            try {
              const logPath = path.join(app.getPath('userData'), 'debug.log')
              const logMessage = `[${new Date().toISOString()}] Arquivo WASM encontrado em: ${testPath}\n`
              fs.appendFileSync(logPath, logMessage)
            } catch (e) {
              // Ignorar erros de log
            }
          }
          
          return testPath
        } else {
          dbLogger.info('❌ Arquivo não encontrado:', testPath)
        }
      }
      
      dbLogger.error('❌ Arquivo WASM não encontrado em nenhum dos caminhos testados')
      throw new Error('Arquivo sql-wasm.wasm não encontrado')
    }

    dbLogger.info('Carregando módulo sql.js...')
    const initSqlJs = await loadSqlJs()

    dbLogger.info('Procurando arquivo WASM...')
    const wasmPath = findWasmPath()

    dbLogger.info('Inicializando sql.js com wasmPath:', wasmPath)
    const SQL = await initSqlJs({
      locateFile: (file: string) => {
        dbLogger.info('sql.js locateFile chamado para:', file)
        if (file === 'sql-wasm.wasm') {
          dbLogger.info('Retornando caminho:', wasmPath)
          return wasmPath
        }
        return file
      }
    })
    
    let data: Uint8Array | undefined;
    
    // Tentar carregar arquivo existente
    dbLogger.info('Verificando se existe arquivo de banco em:', dbPath)
    if (fs.existsSync(dbPath)) {
      dbLogger.info('Carregando banco de dados existente...')
      data = fs.readFileSync(dbPath);
      dbLogger.info('Banco de dados carregado de:', dbPath);
    } else {
      dbLogger.info('Criando novo banco de dados em:', dbPath);
    }
    
    // Criar instância do banco
    dbLogger.info('Criando instância do banco de dados...')
    db = new SQL.Database(data);
    
    // Configurações SQLite
    dbLogger.info('Aplicando configurações SQLite...')
    db.run('PRAGMA journal_mode = WAL');
    db.run('PRAGMA synchronous = NORMAL');
    db.run('PRAGMA foreign_keys = ON');
    
    dbLogger.info('✅ Database connected at:', dbPath);
    
    return db;
  } catch (error) {
    dbLogger.error('❌ Erro ao inicializar banco de dados:', error);
    dbLogger.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    // Mostrar diálogo de erro detalhado
    if (!isDev) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      dialog.showErrorBox(
        'Erro no Banco de Dados',
        `Falha ao inicializar sql.js:\n\n${errorMsg}\n\nVerifique os logs em:\n${app.getPath('userData')}/database.log`
      )
    }
    
    throw error;
  }
}

// Salvar banco de dados no arquivo
export function saveDatabase() {
  if (db) {
    try {
      const data = db.export();
      fs.writeFileSync(dbPath, data);
      dbLogger.info('Banco de dados salvo em:', dbPath);
    } catch (error) {
      dbLogger.error('Erro ao salvar banco de dados:', error);
    }
  }
}

// Getter para o banco de dados
export function getDatabase() {
  if (!db) {
    const error = new Error('Banco de dados não foi inicializado. Chame initDatabase() primeiro.');
    dbLogger.error(error.message);
    throw error;
  }
  return db;
}

// Fechar banco de dados
export function closeDatabase() {
  if (db) {
    saveDatabase();
    db.close();
    db = null;
    dbLogger.info('Database connection closed.');
  }
}

// Salvar automaticamente a cada 30 segundos
setInterval(() => {
  if (db) {
    saveDatabase();
  }
}, 30000);

// Salvar ao sair do aplicativo
process.on('exit', closeDatabase);
process.on('SIGINT', closeDatabase);
process.on('SIGTERM', closeDatabase);

