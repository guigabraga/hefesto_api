const crypto = require('crypto');
const connection = require('./connection');

const CreateUser = async function(data){
    const date = new Date()
    const name = data.name;
    const email = data.email;
    const userType = data.userType;
    const pass = data.pass;
    const passHash = crypto.createHash('sha256').update(pass).digest();
    const passUser = passHash.toLocaleString('hex');
    const dateInsert = date.toLocaleString('af-ZA', {timeZone: 'America/Sao_Paulo'});
    const hash = crypto.createHash('md5').update(dateInsert).digest();
    const hashUser = hash.toLocaleString('hex');
    //Query do Insert no banco de dados
    const queryExecute = `INSERT INTO users (name, email, userType, dateInsert, pass, sit, hashUser) VALUES ('${name}', '${email}', ${userType}, '${dateInsert}', '${passUser}', 1, '${hashUser}')`;
    try{
        const CreateUser = await connection.execute(queryExecute)
        return {
            "status": "success"
            
        }
    }catch(error){
        return {
            "status": "error",
            "msg": error
        }
    }

};

module.exports = {
    CreateUser
};