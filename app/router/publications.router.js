var express = require('express');
var router = express.Router();
const publicationsController = require('../controller/publication.controller.js');

router.post('/:id', publicationsController.create);

module.exports = router;
