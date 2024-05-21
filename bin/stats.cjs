/* -- measured metrics -- */

const measured = require('./measured.cjs')

measured.gauge('memoryUsage', () => process.memoryUsage().rss)
measured.gauge('memoryUsageHeap', () => process.memoryUsage().heapUsed)
measured.gauge('totalUsers', () => connectedUsers())
measured.gauge('totalRooms', () => nbRooms())
measured.meter('connects')
measured.meter('disconnects')

/* -- prom metrics -- */

const prom = require('./prom.cjs')
const { registry, prefix } = require('./prom.cjs')
const initMetrics = require('pm2-prom-module-client').initMetrics

const totalUsers = new prom.Gauge({
  name: `${prefix}total_users`,
  help: 'Show total connected user',
  registers: [registry],
  collect() { this.set(connectedUsers()) }
})
const totalRooms = new prom.Gauge({
  name: `${prefix}total_rooms`,
  help: 'Show total created rooms',
  registers: [registry],
  collect() { this.set(nbRooms()) }
})

initMetrics(registry)

/* -- doc information -- */

const docs = require('./utils.cjs').docs

const connectedUsers = () => {
  let conns = 0
  docs.forEach(doc => { conns += doc.conns.size })
  
  return conns
}

const nbRooms = () => docs.size
