const express = require('express');
const router = express.Router();
const testApiRouter = require('../controller/test');

router.get('/test', function(req, res, next) {
  res.render('test/test');
});

router.get('/pulse', function(req, res, next) {
  res.render('test/pulseTest');
});

router.get('/slider', function(req, res, next) {
  res.render('test/sliderTest');
});

router.get('/timeline', function(req, res, next) {
  res.render('test/timelineTest');
});

router.get('/mongo', function(req, res, next) {
  res.render('test/mongo');
});

router.use('/pg/:id', testApiRouter.select);

module.exports = router;