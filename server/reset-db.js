'use strict';

const fs = require('fs');

const DB_FILENAME = 'db.json';
const EMPTY_SCHEMAS = { invoices: [] };
const SCHEMA_DATA = JSON.stringify(EMPTY_SCHEMAS, null, 2);

fs.writeFile(DB_FILENAME, SCHEMA_DATA, (err) => {
  if (err) {
    throw err;
  }

  console.log('The following schemas have been reset: ["invoices"]');
});
