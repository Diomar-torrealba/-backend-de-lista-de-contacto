const db = require('.');
const createusersTable = async () => {
  const statement = db.prepare(`  
  CREATE TABLE  users (
    user_id INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE
  )
  `);
  statement.run(); 
  console.log('tabla de usuarios creada');
};
const createContactsTable = async () => {
  const statement = db.prepare(`    
    CREATE TABLE  contact (
      contact_id INTEGER PRIMARY KEY,
      name TEXT NOT NULL ,
      phone TEXT NOT NULL UNIQUE,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE   
    )
    `);
  statement.run(); 
  console.log('tabla de contactos creada');
};

const createTables = async () => {
  await createusersTable();
  await createContactsTable();
};

createTables();
