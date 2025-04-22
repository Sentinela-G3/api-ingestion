const axios = require('axios');
require('dotenv').config();
var capturaModel = require("../models/capturaModel");

function obterCaptura(req, res){
    var fkEmpresa = req.body.fkEmpresaServer;

    capturaModel.obterCaptura(fkEmpresa)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao obter os modelos! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
}
module.exports = {
    obterCaptura
}