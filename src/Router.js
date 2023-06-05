const express = require('express')
const router = express.Router()

const ControllerTestDb = require('./controllers/controllerTestDb')
const ControllerCronnosDb = require('./controllers/CotrollerCronnosDb')

router.get('/testDb', ControllerTestDb.ControllerTestDb)
router.post('/new-user', ControllerCronnosDb.CreateUser)
router.post('/select-user', ControllerCronnosDb.SelectUser)

module.exports = router