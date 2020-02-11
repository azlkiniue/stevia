var MongoClient = require('mongodb').MongoClient;
var values = require("../resources/values");
var dbo = null;

exports.connect = function (done) {
  MongoClient.connect(values.mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    dbo = db.db(values.mongoDbName);
    
    return done(err);
  });

  // done();
};

exports.listenChangeStream = function (callback) {
  var collection = dbo.collection(values.mongoCollection);
  var changeStream = collection.watch();
  
  changeStream.on("change", function(changedData) {
    // console.log(change);
    return callback(changedData);
  });
}

exports.get = function () {
  return dbo;
}