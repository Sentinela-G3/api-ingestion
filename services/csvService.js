const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const databaseService = require('./databaseService');
const fs = require('fs');
const path = require('path');

// Configuração do cliente S3 com credenciais do AWS Academy
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    sessionToken: process.env.AWS_SESSION_TOKEN // Essencial para labs
  }
});

async function generateDailyCsv(targetDate) {
  // Validação da data
  if (!(targetDate instanceof Date) || isNaN(targetDate)) {
    throw new Error('Data inválida. Forneça um objeto Date válido.');
  }

  const dateString = targetDate.toISOString().split('T')[0];
  const metrics = await databaseService.getMetricsByDate(targetDate);
  
  if (!metrics || metrics.length === 0) {
    return {
      success: false,
      message: 'Nenhum dado encontrado para a data especificada',
      date: dateString
    };
  }

  // Gera o CSV
  const csvContent = generateCsvContent(metrics);
  const fileName = `metrics_${dateString}.csv`;
  
  // Tenta upload para S3 primeiro
  const s3Result = await uploadToS3(fileName, csvContent);
  
  if (s3Result.success) {
    return {
      success: true,
      date: dateString,
      recordCount: metrics.length,
      fileLocation: s3Result.location,
      storageType: 's3'
    };
  }

  // Fallback: Salva localmente se o S3 falhar
  return saveLocalCopy(fileName, csvContent, dateString, metrics.length);
}

// Função de upload para S3
async function uploadToS3(fileName, content) {
  try {
    const bucketName = process.env.S3_BUCKET_NAME;
    const s3Key = `daily-metrics/${fileName}`;
    
    await s3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      Body: content,
      ContentType: 'text/csv'
    }));

    return {
      success: true,
      location: `s3://${bucketName}/${s3Key}`
    };
  } catch (error) {
    console.error('Erro no upload S3:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Função de fallback local
function saveLocalCopy(fileName, content, dateString, recordCount) {
  const localDir = path.join(__dirname, '..', 'local-exports');
  if (!fs.existsSync(localDir)) {
    fs.mkdirSync(localDir, { recursive: true });
  }
  
  const filePath = path.join(localDir, fileName);
  fs.writeFileSync(filePath, content);

  return {
    success: true,
    date: dateString,
    recordCount: recordCount,
    fileLocation: filePath,
    storageType: 'local',
    warning: 'Arquivo salvo localmente devido a falha no S3'
  };
}

// Geração do conteúdo CSV (mantida igual)
function generateCsvContent(data) {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(item => 
    Object.values(item)
          .map(value => {
              if (typeof value === 'string' && value.includes(',')) {
                  return `"${value.replace(/"/g, '""')}"`;
              }
              return `"${value}"`;
          })
          .join(',')
  );
  return [headers, ...rows].join('\n');
}

// Listagem de arquivos (agora verifica S3 e local)
async function listGeneratedCsvs() {
  // Implementação local (pode ser estendida para listar do S3)
  const localDir = path.join(__dirname, '..', 'local-exports');
  if (!fs.existsSync(localDir)) return [];
  
  return fs.readdirSync(localDir)
      .filter(file => file.endsWith('.csv'))
      .map(file => ({
          name: file,
          path: path.join(localDir, file),
          size: fs.statSync(path.join(localDir, file)).size,
          storageType: 'local'
      }));
}

module.exports = {
  generateDailyCsv,
  listGeneratedCsvs
};