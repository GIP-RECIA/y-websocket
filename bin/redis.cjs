const WSSharedDoc = require('./utils.cjs').WSSharedDoc;
const number = require('lib0/number')
const Redis = require('ioredis');

const config = {
  host: process.env.REDIS_HOST,
  port: number.parseInt(process.env.REDIS_PORT || '6379'),
  keyPrefix: process.env.REDIS_PREFIX,
  path: process.env.REDIS_PATH,
  ...((() => {
    const password = process.env.REDIS_PASSWORD

    if (password && password.length > 0) {
      return { password }
    }

    return {}
  })())
}

// @ts-ignore
const redis = new Redis(config);
module.exports = redis;

// @ts-ignore
module.exports.pub = new Redis(config);

// @ts-ignore
module.exports.sub = new Redis(config);

/**
 * @param {WSSharedDoc} doc 
 * @returns 
 */
const getDocUpdatesKey = (doc) => `doc:${doc.name}:updates`;
exports.getDocUpdatesKey = getDocUpdatesKey

/**
 * @param {WSSharedDoc} doc 
 * @returns 
 */
module.exports.getDocUpdatesFromQueue = async (doc) => {
  return redis.lrangeBuffer(getDocUpdatesKey(doc), 0, -1);
}

/**
 * @param {WSSharedDoc} doc 
 * @param {Uint8Array} update
 */
module.exports.pushDocUpdatesToQueue = async (doc, update) => {
  const len = redis.llen(getDocUpdatesKey(doc));
  if (len > 100) {
    redis.pipeline()
      .lpopBuffer(getDocUpdatesKey(doc))
      .rpushBuffer(getDocUpdatesKey(doc), Buffer.from(update))
      .expire(getDocUpdatesKey(doc), 300)
      .exec()
  } else {
    redis.pipeline()
      .rpushBuffer(getDocUpdatesKey(doc), Buffer.from(update))
      .expire(getDocUpdatesKey(doc), 300)
      .exec();
  }
}
