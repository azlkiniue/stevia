const ip = {
  master: "10.8.0.2", //use with vpn
  bigData: "202.46.4.52",
  sensor: "68.183.177.125",
  local: "127.0.0.1"
}

const values = {
  port : "1228",
  enableSSH: false,
  mongoUrl : "mongodb://admin:jarkoM@"+ ip.bigData +":27017/",
  mongoDbName : "stevia",
  mongoCollection : "event1s",
  sshConf: {
    username:'hduser',
    password:'jarkoM',
    host:ip.master,
    port:22,
    dstHost:ip.db,
    dstPort:27017,
    localHost:'127.0.0.1',
    localPort: 27000
  }
};

module.exports = values;