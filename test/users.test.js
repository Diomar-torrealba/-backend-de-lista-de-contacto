const supertest = require('supertest');
const app = require('../app');
const { describe, test, beforeAll } = require('@jest/globals');
const db = require('../db');
const api = supertest(app);
describe('ruta users', () => {
  describe('crear usuario', () => {
    beforeAll(() => {    
      const statement = db.prepare('DELETE FROM users');
      statement.run();
    });
    test('crea un usuario', async () => {
      const response = await api
        .post('/api/users')
        .send({ email: 'lyon@gmail.com' })
        .expect(200)
        .expect('Content-Type', /json/);
      expect(response.body).toStrictEqual({ message: 'usuario creado' });
    });
    test('error  email  invalido', async () => {
      const response = await api
        .post('/api/users')
        .send({ email: 'lyongmail.com' })
        .expect(400)
        .expect('Content-Type', /json/);
      expect(response.body).toStrictEqual({ error: 'el email es invalido' });
    });
    test('error email ya esta registrado', async () => {
      const response = await api
        .post('/api/users')
        .send({ email: 'lyon@gmail.com' })
        .expect(400)
        .expect('Content-Type', /json/);
      expect(response.body).toStrictEqual({ error: 'el email ya existe ' });
    });
  });
}); 