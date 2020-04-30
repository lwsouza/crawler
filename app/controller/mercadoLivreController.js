const axios = require('axios');
const createLog = require('../utils/generateLogs')

// Função que faz a consulta no site do ML
const searchSite = async (req, res) => {

    var query = req.body.search;

    var limit = req.body.limit;

    // Verifica se os parâmetros foram enviados
    if (query === undefined || limit === undefined) {
        return res.status(400).send("Os parâmetros search e limit são obrigatórios")
    }

    var hostname = `https://api.mercadolibre.com/sites/MLB/search?q=${query}&offset=`;

    var i = 0;

    createLog(query, limit);

    var pages = limit > 50 ? parseInt(limit / 50) : 0;

    var arrayResponse = [];

    // Laço dee repetição onde realiza as requisições na API do ML e vai alterando as páginas conforme a quantidade
    // solicitada e iniciando o processo do novo objeto a ser apresentado na resposta.
    do {
        var response = await axios.get(`${hostname}${i}`);

        // Caso não consiga realizar uma conexão com sucesso, o loop é cancelado
        if (response.status !== 200) {
            var error = true;
            createLog(null, null, error);
            break;
        }

        var results = response.data.results;
        var resultsStore = response.data.available_filters;

        resultsStore = await resultsStore.find(element => element.id == 'official_store')

        if (limit < 50) {
            results = results.slice(0, limit);
        }

        if (limit > 50) {
            limit = limit - 50;
        }

        arrayResponse = await structResponse(arrayResponse, results, resultsStore)

        i++;
    } while (i <= pages);

    // Verificar e retorna ao usuário, informando que não teve sucesso ao conectar na API do ML
    if (error)
        return res.status(400).send("Não foi possível conectar na API do Mercado Livre")
    else
        return res.json(arrayResponse)

}

// Função onde monta a estrutura que deve ser mostrada na resposta
const structResponse = async (arrayResponse, results, resultsStore) => {

    var novaForma;

    // Navega todo o array recebido, montando o modelo que deve ser apresentado
    var newStruct = await results.map(async element => {

        novaForma = new Object();

        novaForma.name = element.title;
        novaForma.link = element.permalink;
        novaForma.price = element.price;
        novaForma.store = element.official_store_id;
        novaForma.state = element.seller_address.state.name;

        return novaForma;
    });

    newStruct = await Promise.all(newStruct);

    // Chama a função para substituir o ID da loja pelo nome
    var structName = await searchNameStore(newStruct, resultsStore);

    // Verifica se o array já foi montado para ir somando mais dados nele
    arrayResponse = arrayResponse.length > 0 ? arrayResponse.concat(structName) : structName

    return arrayResponse;

}

// Função para consultar o nome da loja e atualizar o campo Store
const searchNameStore = async (newStruct, resultsStore) => {

    // Verificar todos os dados do array, substituindo o ID pelo Nome
    var storeName = await newStruct.map(async element => {

        var store = await resultsStore.values.find(attributes => attributes.id == element.store)
        store = store !== undefined ? store.name : null


        element.store = store;

        return element;
    });

    storeName = await Promise.all(storeName);

    return storeName;

}

module.exports = searchSite;