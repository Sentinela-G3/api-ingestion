require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Configurações básicas
const app = express();
const port = process.env.APP_PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/csv', require('./routes/csv'));
app.use('/jira', require('./routes/jira'));


app.listen(port, () => {
  console.log(`
  ==================================
   Servidor rodando na porta ${port}
   Ambiente: ${process.env.AMBIENTE_PROCESSO}
  ==================================
  `);
});