const client = require('prom-client')
module.exports = client

const registry = new client.Registry()
module.exports.registry = registry

const PREFIX = 'app_'
module.exports.prefix = PREFIX

const connects = new client.Counter({
  name: `${PREFIX}connects`,
  help: 'Show total number of connections',
  registers: [registry],
})
module.exports.connects = connects

const disconnects = new client.Counter({
  name: `${PREFIX}disconnects`,
  help: 'Show total number of disconnect',
  registers: [registry],
})
module.exports.disconnects = disconnects
