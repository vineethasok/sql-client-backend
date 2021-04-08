const express = require('express')
var cors = require('cors')
const app = express()
let { dbs, execute_query, initialize_db} = require("./db")

app.use(cors())
app.use(express.json());

app.post('/login', (req, res) => {
  let results = initialize_db(req.body)
  res.json(results)
})

app.get('/login-status', (req, res) => {
  let auth_token = req.query.auth_token
  if (dbs[auth_token]){
    res.json({
      isLoggedIn: true,
      auth_token: auth_token,
    })
  } else {
    res.json({
      isLoggedIn: false
    })
  }
})

app.post('/logout', (req, res) => {
  const auth_token = req.body.auth_token
  if (dbs[auth_token]) {
    dbs[auth_token].$pool.end()
    delete dbs[auth_token]
  }
  res.json({
    isLoggedIn: false
  })
})
app.get('/tables', async (req, res) => {
  let tables = await execute_query(req.query.auth_token, "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';" )
  if (tables.hasOwnProperty("error")) {
    res.json(tables)
  } else {
    let tablesObject = {}
    tables.forEach(table => {
      tablesObject[table.table_name] = {
        fetchedColumns: false
      }
    });
    res.json(tablesObject)
  }
})

app.get('/table/:table_name/columns', async (req, res) => {
  let table_columns = await execute_query(req.query.auth_token, `SELECT column_name AS title FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${req.params['table_name']}';`)
  res.json(table_columns)
})

app.post('/run-query', async (req, res) => {
  let results = await execute_query(req.body.auth_token, req.body.query)
  res.json(results)
})

app.get('/run-query', async (req, res) => {
  let results = await execute_query(req.query.auth_token, req.query.query)
  res.json(results)
})

app.put('/run-query', async (req, res) => {
  let results = await execute_query(req.body.auth_token, req.body.query)
  res.json(results)
})

app.delete('/run-query', async (req, res) => {
  let results = await execute_query(req.body.auth_token, req.body.query)
  res.json(results)
})

app.listen(process.env.PORT || 3001)