const express = require('express')
const app = express()

const jsonServer = require('json-server')

const server = jsonServer.create()

const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
 
server.use(middlewares)
server.use('/', router)
server.listen(process.env.PORT || 3050, () => {
  console.log("JSON Server is running")
})