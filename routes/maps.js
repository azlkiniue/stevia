const express = require('express');
const router = express.Router();

router.get('/map', function (req, res, next) {
  res.render('map/map')
});

router.get('/history', function (req, res, next) {
  res.render('map/history')
});

router.get('/historyWeekly', function (req, res, next) {
  res.render('map/historyWeekly')
});

router.get('/historyMonthly', function (req, res, next) {
  res.render('map/historyMonthly')
});

router.get('/historyQuery', function (req, res, next) {
  res.render('map/historyQuery')
});

module.exports = router;