const { Router } = require('express');
const country = require("./country.js");
const activities = require("./activities.js");


const router = Router();

router.use('/', country);
router.use('/', activities);

module.exports = router;
