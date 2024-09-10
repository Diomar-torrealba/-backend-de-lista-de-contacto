const db = require('../db');

const usersRouter = require('express').Router();
const EMAIL_REGEX =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
usersRouter.post('/', async (request, response) => {
  try {
    const { email } = request.body;
    if (!EMAIL_REGEX.test(email)) {
      return response.status(400).json({ error: 'el email es invalido' });
    }
    const statement = db.prepare(
      'INSERT INTO users (email) VALUES (?)', 
    );
    statement.run(email);
    return response.status(200).json({ message: 'usuario creado' });
  } catch (error) {
    console.log(error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return response.status(400).json({ error: 'el email ya existe ' });
    }
    return response.sendStatus(400);
  }
});

//
module.exports = usersRouter;
