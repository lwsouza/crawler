const request = require('supertest')
const app = require('../app')

const template = {
  search: "cadeado",
  limit: 10
};

const feature = '/'

test('deve verificar se o retorno é um objeto', async () => {

  const { body, statusCode } = await request(app).post(feature).send(template);

  expect(typeof body).toBe('object');

});

test('deve verificar se retorna um array', async () => {

  const { body, statusCode } = await request(app).post(feature).send(template);;

  expect(Array.isArray(body)).toBe(true);

});

test('deve verificar se o status é 200 (sucesso)', async () => {

  const { body, statusCode } = await request(app).post(feature).send(template);

  expect(statusCode).toBe(200);

});