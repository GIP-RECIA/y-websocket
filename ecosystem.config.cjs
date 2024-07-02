module.exports = {
  apps : [{
    name: "y-websocket",
    script: "./bin/server.cjs",
    interpreter: "node@20.13.1",
    env: {
      HOST: "0.0.0.0",
      PORT: 1234,
      REDIS: false,
      REDIS_HOST: '',
      REDIS_PORT: 6379,
      REDIS_PREFIX: '',
      REDIS_PATH: '',
      REDIS_PASSWORD: undefined
    },
    cron_restart: "0 0 * * *",
  }]
}
