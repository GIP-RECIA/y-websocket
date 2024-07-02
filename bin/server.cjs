#!/usr/bin/env node

const WebSocket = require('ws')
const http = require('http')
const number = require('lib0/number')
const wss = new WebSocket.Server({ noServer: true })
const setupWSConnection = require('./utils.cjs').setupWSConnection

const measured = require('./measured.cjs')
require('./stats.cjs')

const host = process.env.HOST || 'localhost'
const port = number.parseInt(process.env.PORT || '1234')

const server = http.createServer((_request, response) => {
  const stopWatch = measured.timer('httpRequests').start()

  if (_request.url === '/monitor') {
    stopWatch.end()
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(measured.toJSON()))
  }

  if (_request.url === '/health-check') {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end()
  }
})

wss.on('connection', setupWSConnection)

server.on('upgrade', (request, socket, head) => {
  // You may check auth of request here..
  // Call `wss.HandleUpgrade` *after* you checked whether the client has access
  // (e.g. by checking cookies, or url parameters).
  // See https://github.com/websockets/ws#client-authentication
  wss.handleUpgrade(request, socket, head, /** @param {any} ws */ ws => {
    wss.emit('connection', ws, request)
  })
})

server.listen(port, host, () => {
  console.log(`running at '${host}' on port ${port}`)
})
