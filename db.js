const pgp = require('pg-promise')()
const dbs = {}
const ERROR_MESSAGE = "Please Check if your query is correct"
const DB_ERROR_MESSAGE = "Db is not connected. Kindly login to continue"

const execute_query = async (auth_token, query) => {
  let results;
  if (dbs.hasOwnProperty(auth_token)) {
    try {
      let obj = await dbs[auth_token].connect()
      results = await obj.any(query);
      obj.done();
      return results
    } catch (error) {
      results = {
        error: ERROR_MESSAGE
      }
    }
  } else {
    results = {
      error: DB_ERROR_MESSAGE
    }
  }
  return results
}

const initialize_db = ({username, database, host, port, password}) => {
  const auth_token = `${username}_${database}`
  try {
    if (!dbs.hasOwnProperty(auth_token)) {
      dbs[auth_token] = pgp(`postgres://${username}:${password}@${host}:${port}/${database}`)
    }
    return {
      isLoggedIn: true,
      auth_token: auth_token,
      database: database,
    }
  } catch (error) {
   return {
     isLoggedIn: false
   }
  }
}

exports.dbs = dbs
exports.execute_query = execute_query
exports.initialize_db = initialize_db
