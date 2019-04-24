var express = require('express');
var router = express.Router();

var testRoute = require('./tests'); 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/test', testRoute);


module.exports = router;
