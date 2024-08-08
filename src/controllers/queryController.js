import { createPool } from 'mysql2/promise';
import config from '../config.js'
import { parse, format } from 'date-fns';


const pool = createPool(config.database);

async function truncateAny() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const sql = `TRUNCATE TABLE ${config.database.name}.${config.tabelaAny}`;
    await connection.execute(sql);

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.log({message: error.message});
    return (error.message);

  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function inserirPedidosAny(pedido) {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    let formatDate = parse(pedido['DATA PEDIDO'], 'dd/MM/yyyy HH:mm:ss', new Date());
    let formatDateShipping = parse(pedido['ENTREGA ESPERADA'], 'dd/MM/yyyy HH:mm:ss', new Date());

    const insertData = {
      ordnoweb: pedido['ID ANYMARKET'],
      ordnochannel: pedido['CÓDIGO PEDIDO'],
      date: format(formatDate, 'yyyy-MM-dd HH:mm:ss'),
      channel: pedido['MARKETPLACE'],
      sku: pedido['SKU DO PRODUTO NO MARKETPLACE'],
      titulo: pedido['TÍTULO PRODUTO'],
      quantidade: pedido['QUANTIDADE'],
      data_entrega: format(formatDateShipping, 'yyyy-MM-dd HH:mm:ss'),
      cliente: pedido['CLIENTE'],
      cpf_cnpj: pedido['CPF/CNPJ'],
      transportadora: pedido['FORMA DE ENTREGA'],
      municipio: pedido['MUNICÍPIO'],
      bairro: pedido['BAIRRO'],
      status: pedido['STATUS'],
      cod_ml: pedido['CÓDIGO DO PEDIDO (PARA PEDIDO CARRINHO)'] || ''
    };

    const fields = Object.keys(insertData);
    const sql = `INSERT IGNORE INTO ${config.database.name}.${config.tabelaAny} (${fields.join(', ')}) VALUES (${fields.map(() => '?').join(', ')})`;
    const values = fields.map(field => insertData[field]);
    await connection.execute(sql, values);

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.log({message: error.message});
    return (error.message);

  } finally {
    if (connection) {
      connection.release();
    }
  }
}


async function verificacaoTabelas() {
  console.log('Iniciando verificação de tabelas');

  try {
    const connection = await pool.getConnection();

    try {
      const sqlCriarTabelaAny = `
      CREATE TABLE IF NOT EXISTS ${config.database.name}.${config.tabelaAny} (
        ordnoweb        varchar(100),
        ordnochannel    varchar(100),
        cod_ml          varchar(100),
        date            timestamp,
        channel         varchar(100),
        sku             varchar(100),
        status          varchar(100),
        primary key     (ordnoweb, sku)
        )
      `

      await connection.query(sqlCriarTabelaAny);
      console.log(`Verificação de tabelas concluidas`);
    } catch (error) {
      console.error('Erro ao executar consulta:', error.message);
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    if (error.code === 'ENOTFOUND') {
      console.error('Erro: O host especificado não pode ser encontrado.');
    } else {
      console.error('Erro desconhecido ao conectar ao banco de dados:', error.message);
    }
    throw error;
  }
}

export { verificacaoTabelas, inserirPedidosAny, truncateAny };