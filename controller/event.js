const moment = require('moment');
const firstBy = require('thenby');

exports.getAggregateDaily = function (req, res) {
  const db = req.app.locals.db.get();
  let dayLimit = moment().subtract(1, 'day');
  
  sendAggregate(db, dayLimit).toArray(function (err, event) {
    if (err) {
      res.send(err);
    } 
    else
      event.sort(function (a, b) {
        return a._id.month - b._id.month || a._id.day - b._id.day || a._id.hour - b._id.hour;
      });
      res.json(event);
  });
}

exports.getAggregateWeekly = function (req, res) {
  const db = req.app.locals.db.get();
  let dayLimit = moment().subtract(1, "week");
  
  sendAggregate(db, dayLimit).toArray(function (err, event) {
    if (err) {
      res.send(err);
    } 
    else
      event.sort(function (a, b) {
        return a._id.month - b._id.month || a._id.day - b._id.day || a._id.hour - b._id.hour;
      });
      res.json(event);
  });
}

exports.getAggregateMonthly = function (req, res) {
  const db = req.app.locals.db.get();
  let dayLimit = moment().subtract(1, "month");
  
  sendAggregate(db, dayLimit).toArray(function (err, event) {
    if (err) {
      res.send(err);
    } 
    else
      res.json(event);
  });
}

const sendAggregate = function (db, dayLimit) {
  return db.collection('event').aggregate([
    {
      $group: {
        _id: {
          month: "$month", 
          day: "$day", 
          hour: "$hour", 
          src_country: "$src_country", 
          dest_country: "$dest_country", 
          alert_message: "$alert_message"
        }, 
        count: {
          $sum: 1
        }
      }
    }, {
      $match: {
        $or: [
          {
            "_id.month" : { $gt : dayLimit.month()+1 }
          },
          {
            $and: [
              {
                "_id.day" : { $gte : dayLimit.date() }
              },
              {
                "_id.month" : dayLimit.month()+1
              }
            ]
          },
          {
            $and: [
              {
                "_id.hour" : { $gte : dayLimit.hour() }
              },
              {
                "_id.day" : dayLimit.date() 
              },
              {
                "_id.month" : dayLimit.month()+1
              }
            ]
          }
        ]
      }
    }
  ])
}