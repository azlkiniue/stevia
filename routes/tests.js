const express = require('express');
const router = express.Router();

router.get('/test', function(req, res, next) {
  res.render('test/test');
});

router.get('/testv4', function(req, res, next) {
  res.render('test/testv4');
});

router.get('/mongo', function(req, res, next) {
  res.render('test/mongo');
});

router.get('/map', function (req, res, next) {
  res.render('test/map')
})

module.exports = router;