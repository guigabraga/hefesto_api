const ModelTestDb = require('../models/ModelTestDb')

const ControllerTestDb = async (req, res) => {

    const TestDb = await ModelTestDb.ModelTestDb();
    return res.status(200).json(TestDb)
};

module.exports = {
    ControllerTestDb
};