'use strict';

const { Client } = require('pg');
const fs = require('fs').promises;

module.exports = async (event, context) => {
  let result = {};

  const user = await fs.readFile('/var/openfaas/secrets/db-user', 'utf8');
  const pass = await fs.readFile('/var/openfaas/secrets/db-password', 'utf8');
  const host = await fs.readFile('/var/openfaas/secrets/db-host', 'utf8');
  const port = process.env['db-port'];
  const name = process.env['db-name'];

  const opts = {
    user: user,
    host: host,
    database: name,
    password: pass,
    port: port,
  };
  
  if (event.method == 'GET') {
    const client = new Client(opts);
    await client.connect();
    const res = await client.query(
      'SELECT id, url, description, created_at from links',
    );
    result = res.rows;
    await client.end();
  } else if (event.method == 'POST') {
    const client = new Client(opts);
    await client.connect();
    const res = await client.query(
      'INSERT INTO links(id, url, description, created_at)' +
        ' VALUES (DEFAULT, $1, $2, now())',
      [event.body.url, event.body.description],
    );
    result = res.rows[0];
    await client.end();
  }

  return context.status(200).succeed({
    ...result
  });
};
