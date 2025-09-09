// Teste isolado para sql.js
console.log('Iniciando teste do sql.js...');

try {
  const initSqlJs = require('sql.js');
  const path = require('path');
  const fs = require('fs');
  
  console.log('sql.js importado com sucesso');
  console.log('__dirname:', __dirname);
  console.log('process.cwd():', process.cwd());
  
  // Testar caminhos para o arquivo WASM
  const possiblePaths = [
    path.join(__dirname, 'node_modules/sql.js/dist/sql-wasm.wasm'),
    path.join(process.cwd(), 'node_modules/sql.js/dist/sql-wasm.wasm'),
  ];
  
  console.log('\nTestando caminhos WASM:');
  let wasmPath = null;
  
  for (const testPath of possiblePaths) {
    console.log('Testando:', testPath);
    if (fs.existsSync(testPath)) {
      console.log('✅ Encontrado!');
      wasmPath = testPath;
      break;
    } else {
      console.log('❌ Não encontrado');
    }
  }
  
  if (!wasmPath) {
    throw new Error('Arquivo WASM não encontrado');
  }
  
  console.log('\nInicializando sql.js...');
  initSqlJs({
    locateFile: (file) => {
      console.log('locateFile chamado para:', file);
      if (file === 'sql-wasm.wasm') {
        console.log('Retornando:', wasmPath);
        return wasmPath;
      }
      return file;
    }
  }).then((SQL) => {
    console.log('✅ sql.js inicializado com sucesso!');
    
    const db = new SQL.Database();
    console.log('✅ Banco de dados criado!');
    
    db.run('CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)');
    db.run('INSERT INTO test (name) VALUES (?)', ['Teste']);
    
    const result = db.exec('SELECT * FROM test');
    console.log('✅ Teste executado:', result);
    
    console.log('✅ Todos os testes passaram!');
  }).catch((error) => {
    console.error('❌ Erro ao inicializar sql.js:', error);
  });
  
} catch (error) {
  console.error('❌ Erro durante importação:', error);
}
