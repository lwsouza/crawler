var searchML = require('../controller/mercadoLivreController');

module.exports = (app) => {

    // Rota de entrada
    app.get('/', function (req, res) {
        res.send('Olá, se enviar um método Post traremos a quantidade de dados solicitado!');
    });

    // Rota para trazer os dados
    app.post('/', searchML);
}


