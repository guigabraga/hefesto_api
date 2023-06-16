const crypto = require('crypto')
const connection = require('./connection')

//Contrução de data:
const date = new Date()
const dateInsert = date.toLocaleString('af-ZA', {timeZone: 'America/Sao_Paulo'})

const CreateUser = async function(data){
    const date = new Date()
    const name = data.name
    const email = data.email
    const userType = data.userType
    const pass = data.pass
    const passHash = crypto.createHash('sha256').update(pass).digest()
    const passUser = passHash.toLocaleString('hex')
    const dateInsert = date.toLocaleString('af-ZA', {timeZone: 'America/Sao_Paulo'})
    const hash = crypto.createHash('md5').update(dateInsert).digest()
    const hashUser = hash.toLocaleString('hex')
    //Query do Insert no banco de dados
    const queryExecute = `INSERT INTO users (name, email, userType, dateInsert, pass, sit, hashUser) VALUES ('${name}', '${email}', ${userType}, '${dateInsert}', '${passUser}', 1, '${hashUser}')`
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

const SelectUser = async function(data){
    const email = data.email;
    const queryExecute = `SELECT COUNT(*) AS count FROM users WHERE email = '${email}'`
    try{
        const SelectUser = await connection.execute(queryExecute)
        return {
            "status": "success",
            "msg": SelectUser[0][0].count
        }
    }catch(error){
        return {
            "status": "error",
            "msg": error
        }
    }
};

const UpdatePass = async function(data){
    const date = new Date()
    const dateUpdate = date.toLocaleString('af-ZA', {timeZone: 'America/Sao_Paulo'})
    const email = data.email
    const pass = data.pass
    const passHash = crypto.createHash('sha256').update(pass).digest();
    const passUser = passHash.toLocaleString('hex')
    const hashUser = data.hashUser
    const queryExecute = `UPDATE users SET pass = '${passUser}', dateUpdate = '${dateUpdate}' WHERE hashUser = '${hashUser}' AND email = '${email}'`
    try{
        const UpdatePass = await connection.execute(queryExecute)
        return {
            "status": "success"   
        }
    }catch(error){
        return {
            "status": "error",
            "msg": error
        }
    }
}

const SelectDataUser = async function(data){
    const email = data.email
    const queryExecute = `SELECT * FROM users WHERE email = '${email}'`
    try{
        const SelectDataUser = await connection.execute(queryExecute)
        return{
            "status": "success",
            "data": SelectDataUser
        }
    }catch(error){
        return{
            "status": "error",
            "msg": error
        }
    }
}

//Função para consultar no banco e autenticar o usuário:
const AuthUser = async function(data){
    //Parametros para autenticar:
    const emailAuth = data.email
    const passAuth = data.pass
    const passHash = crypto.createHash('sha256').update(passAuth).digest();
    const passUser = passHash.toLocaleString('hex')
    //Query de SELECT no banco de dados:
    const queryAuth = `SELECT * FROM users WHERE email = '${emailAuth}' AND pass = '${passUser}'`
    try{
        //Execução da query:
        const AuthUser = await connection.execute(queryAuth)
        //Insert na tabela de LOgs:
        const objLogs = [AuthUser[0][0].hashUser, 'Login', `Usuário ${AuthUser[0][0].name}, autenticado e logado com sucesso!`]
        await InsertLogs(objLogs)
        //Retorno de sucesso:
        return{
            "status": "success",
            "data": AuthUser
        }
    }catch(error){
        //Retorno de erro:
        return{
            "status": "error",
            "msg": error
        }
    }

}

//Função para isert de logs:
const InsertLogs = async function(data){
    const hash_user = data[0]
    const title = data[1]
    const description = data[2]
    const preHashProtocol = crypto.createHash('md5').update(dateInsert).digest()
    const hash_protocol = preHashProtocol.toLocaleString('hex')
    const queryLogs = `INSERT INTO logs (date_insert, hash_user, title, description, hash_protocol) VALUES ('${dateInsert}', '${hash_user}', '${title}', '${description}', '${hash_protocol}')`
    const InsertLogs = await connection.execute(queryLogs)
}

module.exports = {
    CreateUser,
    SelectUser,
    UpdatePass,
    SelectDataUser,
    AuthUser
};