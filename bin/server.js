#!/usr/bin/env node

/**
 * @type {any}
 */
const WebSocket = require('ws')
const http = require('http')
const wss = new WebSocket.Server({ noServer: true })
const { docs, setupWSConnection } = require('./utils.js')
const stats = require('./stats.js')

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 1234

stats.gauge('memoryUsage', () => process.memoryUsage().rss)
stats.gauge('memoryUsageHeap', () => process.memoryUsage().heapUsed)
stats.gauge('totalUsers', () => {
  let conns = 0
  docs.forEach(doc => { conns += doc.conns.size })

  return conns
})
stats.gauge('totalRooms', () => docs.size)
stats.meter('connects')
stats.meter('disconnects')

const server = http.createServer((request, response) => {
  const stopWatch = stats.timer('httpRequests').start()

  if (request.url === '/monitor') {
    stopWatch.end()
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(stats.toJSON()))
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
