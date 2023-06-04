const express = require('express');
const router = express.Router();

const ControllerTestDb = require('./controllers/controllerTestDb')

router.get('/testDb', ControllerTestDb.ControllerTestDb)

module.exports = router;