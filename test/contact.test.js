const supertest = require('supertest');
const app = require('../app');
const { describe, test, expect, beforeAll } = require('@jest/globals');
const db = require('../db');
const api = supertest(app);
let user;
let contact;
let contacts = [
  {
    name: 'Diego Vegas',
    phone: '02121234567',
  },
  {
    name: 'Daniela Perez',
    phone: '04121234567',
  },
  
];
describe('ruta contacts', () => {
  describe('crear contacto', () => {
    beforeAll(() => {
      const statementDeleteusers = db.prepare('DELETE FROM users');
      statementDeleteusers.run();
      const statementCreateUser = db.prepare(
        `
      INSERT INTO users (email) VALUES (?) RETURNING *
    `,
      );
      user = statementCreateUser.get('lyon@gmail.com');
    });
    test('crea un contacto', async () => {
      const response = await api
        .post('/api/contacts')
        .query({ userId: user.user_id })
        .send({ name: 'Daniela Perez', phone: '04121234567' })
        .expect(200)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({
        contact_id: 1,
        name: 'Daniela Perez',
        phone: '04121234567',
        user_id: 1,
      });
    });
  });
  describe('eliminar contacto', () => {
    beforeAll(() => {
     
      const statementDeleteusers = db.prepare('DELETE FROM users');
      statementDeleteusers.run();
      const statementCreateUser = db.prepare(
        `
      INSERT INTO users (email) VALUES (?) RETURNING *
    `,
      );
      user = statementCreateUser.get('nnn@gmail.com');
      const statementDeleteContacts = db.prepare('DELETE FROM contact');
      statementDeleteContacts.run();
      const statementCreateContact = db.prepare(
        `
      INSERT INTO contact (name, phone, user_id) VALUES (?, ?, ?) RETURNING *
    `,
      );
      contact = statementCreateContact.get('Daniela Perez', '04121234567', user.user_id);
    });
    test('elimina un contacto cuando todo es correcto', async () => {
      const response = await api
        .delete(`/api/contacts/${contact.contact_id}`)
        .query({ userId: user.user_id })
        .expect(200)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({
        message: 'El contacto Daniela Perez ha sido eliminado',
      });
    });
    test('no elimina cuando el usuario no pertenece al contacto', async () => {
      const response = await api
        .delete(`/api/contacts/${contact.contact_id}`)
        .query({ userId: user.user_id + 1 })
        .expect(400)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({
        message: 'el contacto no existe',
      });
    });
    test('no elimina cuando el contacto no existe', async () => {
      const response = await api
        .delete(`/api/contacts/${contact.contact_id + 1}`)
        .query({ userId: user.user_id })
        .expect(400)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({
        message: 'el contacto no existe',
      });
    });
  });
  describe('actualizar contacto', () => {
    beforeAll(() => {
      const statementDeleteusers = db.prepare('DELETE FROM users');
      statementDeleteusers.run();
      const statementCreateUser = db.prepare(
        `
      INSERT INTO users (email) VALUES (?) RETURNING *
    `,
      );
      user = statementCreateUser.get('lyon@gmail.com');
      const statementDeleteContacts = db.prepare('DELETE FROM contact');
      statementDeleteContacts.run();
      const statementCreateContact = db.prepare(
        `
      INSERT INTO contact (name, phone, user_id) VALUES (?, ?, ?) RETURNING *
    `,
      );
      contact = statementCreateContact.get('Daniela Perez', '04122154509', user.user_id);
    });
    test('actualiza un contacto cuando todo es correcto', async () => {
      const response = await api
        .put(`/api/contacts/${contact.contact_id}`)
        .send({ name: 'Jesus Vegas', phone: '04141111111' })
        .query({ userId: user.user_id })
        .expect(200)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({
        contact_id: 1,
        name: 'Jesus Vegas',
        phone: '04141111111',
        user_id: 1,
      });
    });
    test('no actualiza cuando el usuario no pertenece al contacto', async () => {
      const response = await api
        .put(`/api/contacts/${contact.contact_id}`)
        .send({ name: 'Jesus Vegas', phone: '04141111111' })
        .query({ userId: user.user_id + 1 })
        .expect(400)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({
        message: 'el contacto no existe',
      });
    });
    test('no elimina cuando el contacto no existe', async () => {
      const response = await api
        .put(`/api/contacts/${contact.contact_id + 1}`)
        .send({ name: 'Jesus Vegas', phone: '04141111111' })
        .query({ userId: user.user_id })
        .expect(400)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({
        message: 'el contacto no existe',
      });
    });
  });
  describe('obtener contacto', () => {
    beforeAll(() => {
      const statementDeleteusers = db.prepare('DELETE FROM users');
      statementDeleteusers.run();
      const statementCreateUser = db.prepare(
        `
      INSERT INTO users (email) VALUES (?) RETURNING *
    `,
      );
      user = statementCreateUser.get('lyon@gmail.com');
      const statementDeleteContacts = db.prepare('DELETE FROM contact');
      statementDeleteContacts.run();
      contacts = contacts.map((contact) => {
        const statementCreateContact = db.prepare(
          `
        INSERT INTO contact (name, phone, user_id) VALUES (?, ?, ?) RETURNING *
      `,
        );
        return statementCreateContact.get(contact.name, contact.phone, user.user_id);
      });
    });
    test('obtengo los contactos cuando todo es correcto', async () => {
      const response = await api
        .get('/api/contacts/')
        .query({ userId: user.user_id })
        .expect(200)
        .expect('Content-type', /json/);
      expect(response.body.length).toBe(contacts.length);
    });
    test('obtengo los contatos cuando el usuario no inicio sesion', async () => {
      const response = await api
        .get('/api/contacts/')
        .query({ userId: null })
        .expect(401)
        .expect('Content-type', /json/);
      expect(response.body).toStrictEqual({
        error: 'No tienes los permisos',
      });
    });
  });
});
