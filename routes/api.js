const express = require('express');
const router = express.Router();
const eventRouter = require('../controller/event');

router.use('/daily', eventRouter.getAggregateDaily);
router.use('/weekly', eventRouter.getAggregateWeekly);
router.use('/monthly', eventRouter.getAggregateMonthly);
router.use('/query', eventRouter.getByQuery);

module.exports = router;