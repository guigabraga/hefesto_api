const express = require('express');
const router = express.Router();

const ControllerTestDb = require('./controllers/controllerTestDb')
const CreateUser = require('./controllers/CotrollerCronnosDb');

router.get('/testDb', ControllerTestDb.ControllerTestDb)
router.post('/new-user', CreateUser.CreateUser)

module.exports = router;