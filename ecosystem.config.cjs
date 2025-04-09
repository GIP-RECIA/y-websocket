module.exports = {
  apps : [{
    name: 'y-websocket',
    script: './bin/server.cjs',
    // interpreter: 'node@22.14.0',
    // exec_mode: 'cluster',
    // instances: 4,
    max_memory_restart: '500M',
    env: {
      HOST: '0.0.0.0',
      PORT: 1234,
      REDIS: false,
      REDIS_HOST: '0.0.0.0',
      REDIS_PORT: 6379,
      REDIS_PREFIX: 'YWS_',
      REDIS_PATH: '',
      REDIS_PASSWORD: undefined
    },
    combine_logs: true,
    merge_logs: true,
    time: true,
    cron_restart: '0 0 * * *',
  }]
}
