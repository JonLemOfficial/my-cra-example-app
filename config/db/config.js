const { join } = require('path');

if ( process.env.NODE_ENV === 'development' ) {
  require('dotenv')
    .config({ path: join(__dirname, '..', '..', '.env') });
}

const {
  // local server env vars
  DB_LOCAL_DRIVER,
  DB_LOCAL_USER,
  DB_LOCAL_PASS,
  DB_LOCAL_HOST,
  DB_LOCAL_PORT,
  DB_LOCAL_NAME,
  DB_LOCAL_URI,

  // remote server  env vars
  DB_REMOTE_DRIVER,
  DB_REMOTE_USER,
  DB_REMOTE_PASS,
  DB_REMOTE_HOST,
  DB_REMOTE_PORT,
  DB_REMOTE_NAME,
  DB_REMOTE_URI,
} = process.env;

module.exports = {
  development: {
    username: DB_LOCAL_USER,
    password: DB_LOCAL_PASS,
    database: DB_LOCAL_NAME,
    host: DB_LOCAL_HOST,
    port: DB_LOCAL_PORT,
    dialect: DB_LOCAL_DRIVER
  },
  test: {
    username: DB_REMOTE_USER,
    password: DB_REMOTE_PASS,
    database: DB_REMOTE_NAME,
    host: DB_REMOTE_HOST,
    port: DB_REMOTE_PORT,
    dialect: DB_REMOTE_DRIVER
  },
  production: {
    username: DB_REMOTE_USER,
    password: DB_REMOTE_PASS,
    database: DB_REMOTE_NAME,
    host: DB_REMOTE_HOST,
    port: DB_REMOTE_PORT,
    dialect: DB_REMOTE_DRIVER,
    uri: DB_REMOTE_URI
  }
};
