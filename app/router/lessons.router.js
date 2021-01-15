var express = require('express');
var router = express.Router();
const lessonsController = require('../controller/lessons.controller.js');

router.get('/', lessonsController.getAll);
router.post('/', lessonsController.create);
router.put('/:id', lessonsController.update);
router.delete('/:id', lessonsController.remove);

module.exports = router;
