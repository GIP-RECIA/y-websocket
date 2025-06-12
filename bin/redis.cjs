const number = require('lib0/number')
const Redis = require('ioredis')

const isRedisEnabled = process.env.REDIS === 'true'

if (isRedisEnabled) {
  const config = {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: number.parseInt(process.env.REDIS_PORT || '6379'),
    keyPrefix: process.env.REDIS_PREFIX,
    path: process.env.REDIS_PATH,
    ...((() => {
      const password = process.env.REDIS_PASSWORD

      return password && password.length > 0 ? { password } : {}
    })())
  }
  const ttl = process.env.REDIS_TTL || 300

  console.log(`Redis has been enabled with config ${config.host}:${config.port}`)

  const redis = new Redis(config)
  module.exports = redis

  module.exports.isRedisEnabled = isRedisEnabled

  module.exports.pub = new Redis(config)

  module.exports.sub = new Redis(config)

  const getDocUpdatesKey = (doc) => `doc:${doc.name}:updates`
  exports.getDocUpdatesKey = getDocUpdatesKey

  module.exports.getDocUpdatesFromQueue = async (doc) => {
    return redis.lrangeBuffer(getDocUpdatesKey(doc), 0, -1)
  }

  module.exports.pushDocUpdatesToQueue = async (doc, update) => {
    const len = redis.llen(getDocUpdatesKey(doc))
    if (len > 100) {
      redis.pipeline()
        .lpopBuffer(getDocUpdatesKey(doc))
        .rpushBuffer(getDocUpdatesKey(doc), Buffer.from(update))
        .expire(getDocUpdatesKey(doc), ttl)
        .exec()
    } else {
      redis.pipeline()
        .rpushBuffer(getDocUpdatesKey(doc), Buffer.from(update))
        .expire(getDocUpdatesKey(doc), ttl)
        .exec()
    }
  }
}
