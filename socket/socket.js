let publicSocket = null;

const configure = function (io) {
    if (!isConfigured())
        publicSocket = io;
    errCatch();
};

const isConfigured = function () {
    return publicSocket != null;
};

const emitEvent = function (eventName, body) {
    publicSocket.emit(eventName, body);
};

const notifyUpdateMongo = function (data) {
    emitEvent("mongoStream", data);
}

const errCatch = function () {
    publicSocket.on('error', function(e){
        console.log(e);
    });
}

module.exports = {
  configure,
  notifyUpdateMongo,
  emitEvent
}