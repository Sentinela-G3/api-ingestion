const mysql = require('mysql2/promise');
const { format } = require('date-fns');

// Configuração da conexão
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


async function getMetricsByDate(date) {
  const dateString = format(date, 'yyyy-MM-dd');
  
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [rows] = await connection.execute(`
      SELECT 
        m.id_maquina,
        m.serial_number,
        c.tipo AS metric_type,
        h.valor AS value,
        h.data_captura AS timestamp
      FROM 
        historico h
        JOIN componente c ON h.fk_historico_componente = c.id_componente
        JOIN maquina m ON c.fk_componente_maquina = m.id_maquina
      WHERE 
        DATE(h.data_captura) = ?
      ORDER BY 
        h.data_captura ASC
    `, [dateString]);

    return rows.map(row => ({
      ...row,
      timestamp: format(new Date(row.timestamp), "yyyy-MM-dd HH:mm:ss")
    }));

  } catch (error) {
    console.error('Erro na consulta ao banco:', error);
    throw new Error('Falha ao recuperar métricas do banco de dados');
  } finally {
    if (connection) connection.release();
  }
}


async function closePool() {
  await pool.end();
}

module.exports = {
  getMetricsByDate,
  closePool
};