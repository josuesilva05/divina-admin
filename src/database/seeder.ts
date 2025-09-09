import { getDatabase, saveDatabase } from './database';

export function runMigrations() {
  try {
    const db = getDatabase();
    
    db.run(`
      CREATE TABLE IF NOT EXISTS servicos (
        id_servico TEXT PRIMARY KEY,
        nome TEXT NOT NULL,
        preco REAL NOT NULL
      );
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS caixa_registros (
        id_caixa INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo_registro TEXT NOT NULL CHECK(tipo_registro IN ('Entrada', 'Saída')),
        categoria TEXT NOT NULL,
        servico_id TEXT,
        valor REAL NOT NULL,
        descricao TEXT,
        data TEXT NOT NULL,
        formaPagamento TEXT NOT NULL CHECK(formaPagamento IN ('Dinheiro', 'Cartão', 'PIX', 'Débito', 'Crédito')),
        FOREIGN KEY (servico_id) REFERENCES servicos (id_servico)
      );
    `);

    // Verificar se a tabela de serviços está vazia
    const countStmt = db.prepare('SELECT COUNT(*) as count FROM servicos');
    countStmt.step();
    const result = countStmt.getAsObject();
    countStmt.free();
    
    if (result.count === 0) {
      const insertStmt = db.prepare(
        'INSERT INTO servicos (id_servico, nome, preco) VALUES (?, ?, ?)'
      );
      
      // Serviços de Unha
      insertStmt.run(['1', 'Pé e mão (simples)', 35.00]);
      insertStmt.run(['2', 'Pé e mão (design)', 50.00]);
      insertStmt.run(['3', 'Esmaltação em gel', 25.00]);
      insertStmt.run(['4', 'Unha postiça', 45.00]);
      insertStmt.run(['5', 'Unha postiça + pé', 60.00]);
      insertStmt.run(['6', 'Spa dos pés', 40.00]);
      
      // Serviços de Cabelo
      insertStmt.run(['7', 'Escova', 30.00]);
      insertStmt.run(['8', 'Coloração', 120.00]);
      insertStmt.run(['9', 'Progressiva', 180.00]);
      insertStmt.run(['10', 'Corte', 40.00]);
      insertStmt.run(['11', 'Corte (finalização)', 45.00]);
      insertStmt.run(['12', 'Corte (sem finalização)', 35.00]);
      insertStmt.run(['13', 'Hidratação', 50.00]);
      insertStmt.run(['14', 'Reconstração', 60.00]);
      insertStmt.run(['15', 'Nutrição', 55.00]);
      
      // Serviços de Estética
      insertStmt.run(['16', 'Buço', 15.00]);
      insertStmt.run(['17', 'Cílios look francês', 80.00]);
      
      insertStmt.free();
      
      // Salvar as mudanças
      saveDatabase();
      
      console.log('Serviços inseridos com sucesso.');
    }

    console.log('Migrations executed successfully.');
  } catch (error) {
    console.error('Error running migrations:', error);
  }
}
