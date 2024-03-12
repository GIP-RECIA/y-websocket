#!/usr/bin/env node

/**
 * @type {any}
 */
const WebSocket = require('ws')
const http = require('http')
const wss = new WebSocket.Server({ noServer: true })
const setupWSConnection = require('./utils.js').setupWSConnection
const measured = require('./measured.js')
require('./stats.js')

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 1234

const server = http.createServer((request, response) => {
  const stopWatch = measured.timer('httpRequests').start()

  if (request.url === '/monitor') {
    stopWatch.end()
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(measured.toJSON()))
  }

  if (request.url === '/health-check') {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end()
  }
})

wss.on('connection', setupWSConnection)

server.on('upgrade', (request, socket, head) => {
  // You may check auth of request here..
  // See https://github.com/websockets/ws#client-authentication
  /**
   * @param {any} ws
   */
  const handleAuth = ws => {
    wss.emit('connection', ws, request)
  }
  wss.handleUpgrade(request, socket, head, handleAuth)
})

server.listen(port, host, () => {
  console.log(`running at '${host}' on port ${port}`)
})
