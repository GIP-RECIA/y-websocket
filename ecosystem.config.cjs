module.exports = {
  apps : [{
    name: "y-websocket",
    script: "./bin/server.cjs",
    interpreter: "node@20.13.1",
    env: {
      HOST: "0.0.0.0",
      PORT: 1234,
    },
    cron_restart: "0 0 * * *",
  }]
}
