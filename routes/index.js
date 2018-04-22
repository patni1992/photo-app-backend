var router = require('express').Router();

router.use('/images', require('./images'));
router.use('/users', require('./user'));

module.exports = router;
