const jsonService = require("../services/jsonService");

async function exportJSON(req, res) {
  try {
    const result = await jsonService.generateDailyJson(new Date());
    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'JSON gerado e armazenado com sucesso',
        data: {
          s3Location: result.s3Location,
          recordCount: result.recordCount,
          generatedAt: result.generatedAt
        }
      });
    } else {
      res.status(200).json({
        success: false,
        message: 'Nenhum dado encontrado para o período',
        data: {
          dateUsed: result.dateUsed
        }
      });
    }

  } catch (error) {
    console.error('Erro na exportação:', error);
    
    res.status(500).json({
      success: false,
      error: 'Falha ao processar a requisição'
    });
  }
}

module.exports = {
    exportJSON
};