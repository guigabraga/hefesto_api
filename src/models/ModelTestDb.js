const connection = require('./connection');

const ModelTestDb = async () => {
    const testConnection = await connection.execute('SELECT * FROM testDb');
    return testConnection[0][0];
};

module.exports = {
    ModelTestDb
};