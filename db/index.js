const Database = require('better-sqlite3');
const db = Database('contactos.db'); 

module.exports = db; 
