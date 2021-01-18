var express = require('express');
var router = express.Router();
const publicationsController = require('../controller/publication.controller.js');

router.post('/lesson/:id', publicationsController.create);
router.put('/:id', publicationsController.update);
router.delete('/:id', publicationsController.remove);
router.get('/:id', publicationsController.getById);
router.get('/', publicationsController.getAll);

module.exports = router;
