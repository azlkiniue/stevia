const moment = require('moment');
const values = require('../resources/values');

exports.getAggregateDaily = function (req, res) {
  const db = req.app.locals.db.mongo.get();
  let dayLimit = moment().subtract(1, 'day');
  
  sendAggregate(db, dayLimit, 15, "minute").toArray(function (err, event) {
    if (err) {
      res.send(err);
    } 
    else
      res.json(event);
  });
}

exports.getAggregateWeekly = function (req, res) {
  const db = req.app.locals.db.mongo.get();
  let dayLimit = moment().subtract(1, "week");
  
  sendAggregate(db, dayLimit).toArray(function (err, event) {
    if (err) {
      res.send(err);
    } 
    else
      res.json(event);
  });
}

exports.getAggregateMonthly = function (req, res) {
  const db = req.app.locals.db.mongo.get();
  let dayLimit = moment().subtract(1, "month");
  
  sendAggregate(db, dayLimit).toArray(function (err, event) {
    if (err) {
      res.send(err);
    } 
    else
      res.json(event);
  });
}

exports.getByQuery = function (req, res) {
  const db = req.app.locals.db.mongo.get();
  let dayLimit = moment(req.query.date, "YYYY-MM-DD");

  sendAggregate(db, dayLimit).toArray(function (err, event) {
    if (err) {
      res.send(err);
    } 
    else
      res.json(event);
  });
}

const sendAggregate = function (db, dayLimit, timeAmount, timeUnit) {
  let unit = {};
  unit[`$${timeUnit}`] = "$timestamp";
  const granulity = { "$subtract": [
    unit,
    { "$mod": [unit, timeAmount ]}
  ]};
  return db.collection(values.mongoCollection).aggregate([
    {
      $match: {timestamp: {$gt: dayLimit.toDate()}}
    }, {
      $group: {
        _id: {
          interval: {
            "$subtract": [
                { "$subtract": [ "$timestamp", new Date("1970-01-01") ] },
                { "$mod": [
                    { "$subtract": [ "$timestamp", new Date("1970-01-01") ] },
                    1000 * 60 * 15
                ]}
            ]
        },
          time: {"$min": "$timestamp"},
          src_country: "$src_country_iso_code", 
          dest_country: "$dest_country_iso_code", 
          alert_message: "$alert_message"
        },
        count: {
          $sum: 1
        }
      }
    }, {
      $sort: {
        '_id.interval': -1
      }
    }, {
      $limit: 150
    }, {
      $sort: {
        '_id.time': 1
      }
    }
  ],
  {allowDiskUse: true});
}