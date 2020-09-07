const ip = {
  external: "database.server.com",
  local: "127.0.0.1"
}

const values = {
  port : "1228",
  enableSSH: false,
  mongoUrl : `mongodb://dbuser:secretpassword@${ip.local}:27018/`,
  mongoDbName : "stevia",
  mongoCollection : "event1s",
  pgUrl = `postgresql://dbuser:secretpassword@${ip.local}:3211/mydb`,
  sshConf: {
    username:'sshUser',
    password:'secretpassword',
    host:ip.external,
    port:22,
    dstHost:ip.external,
    dstPort:27017,
    localHost:'127.0.0.1',
    localPort: 27000
  }
};

module.exports = values;