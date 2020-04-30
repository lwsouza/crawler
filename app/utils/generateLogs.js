const fs = require('fs');

const createLog = async (query, limit, error) => {

    var data;

    if (error) {
        data = `Falha ao realizar a consulta, verifique se a API do Mercado Livre está online. \n`;
    } else {
        data = `O Usuário pesquisou a palavra "${query}" com limite de ${limit}. \n`;
    }

    fs.writeFile('logs/logs.txt', data, {enconding:'utf-8',flag: 'a'},(err) => {
        if (err) throw err;
    });

}

module.exports = createLog;