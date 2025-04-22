const AWS = require('aws-sdk');
const fs = require('fs');

// Configuração das credenciais e região
AWS.config.update({
  accessKeyId: 'SEU_ACCESS_KEY',
  secretAccessKey: 'SEU_SECRET_KEY',
  region: 'us-west-2' // ou a região do seu bucket
});

// Criar uma instância do S3
const s3 = new AWS.S3();

// Definir o caminho do arquivo a ser enviado
const filePath = 'caminho/para/seu/arquivo.txt';
const fileContent = fs.readFileSync(filePath);

// Definir os parâmetros para o upload
const params = {
  Bucket: 'bucket-raw-sentinela', // Nome do seu bucket
  Key: 'dadosCaptura.csv', // Nome do arquivo no S3
  Body: fileContent,         // Conteúdo do arquivo
  ACL: 'public-read'         // Definir permissões do arquivo, se necessário
};

// Realizar o upload
s3.upload(params, (err, data) => {
  if (err) {
    console.log("Erro ao fazer upload:", err);
  } else {
    console.log("Arquivo enviado com sucesso:", data);
  }
});