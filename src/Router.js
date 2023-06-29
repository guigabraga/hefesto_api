const express = require('express')
const router = express.Router()

const ControllerTestDb = require('./controllers/controllerTestDb')
const ControllerCronnosDb = require('./controllers/CotrollerCronnosDb')
const ControllerArtemis = require('./controllers/controllerArtemis')

//Cronnos:
//GET
router.get('/testDb', ControllerTestDb.ControllerTestDb)
router.get('/select-logs', ControllerCronnosDb.SelectLogs)
//POST
router.post('/new-user', ControllerCronnosDb.CreateUser)
router.post('/select-user', ControllerCronnosDb.SelectUser)
router.post('/select-data-user', ControllerCronnosDb.SelectDataUser)
router.post('/update-pass', ControllerCronnosDb.UpdatePass)
router.post('/auth-user', ControllerCronnosDb.AuthUser)
router.post('/insert-product', ControllerCronnosDb.InsertProduct)
router.post('/select-product', ControllerCronnosDb.SelectProduct)

//Atermis
router.post('/artemis', ControllerArtemis.FlowArtemis)
router.post('/artemis/get-conversation', ControllerArtemis.GetConversation)

module.exports = router