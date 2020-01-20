var express = require('express');
var router = express.Router();

var testRoute = require('./tests');
var mapRoute = require('./maps'); 
var apiRoute = require('./api');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'STEVIA' });
});

router.use('/test', testRoute);
router.use('/map', mapRoute);
router.use('/api', apiRoute);

module.exports = router;
