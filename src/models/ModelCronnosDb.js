const crypto = require('crypto')
const connection = require('./connection')
const { json } = require('express')

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
        const CreateUser = await connection.cronnos.execute(queryExecute)
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
        const SelectUser = await connection.cronnos.execute(queryExecute)
        return {
            "status": "success",
            "msg": SelectUser[0][0].count
        }
    }catch(error){
        return {
            "status": "error",
            "msg": errorconnection
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
        const UpdatePass = await connection.cronnos.execute(queryExecute)
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
        const SelectDataUser = await connection.cronnos.execute(queryExecute)
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
        const AuthUser = await connection.cronnos.execute(queryAuth)
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

//Função de Select de Logs:
const SelectLogs = async function(){

    const querySelectLogs = `SELECT users.name, logs.date_insert, logs.title, logs.description FROM logs INNER JOIN users ON users.hashUser=logs.hash_user ORDER BY date_insert DESC LIMIT 10;`
    try{
        const SelectLogs = await connection.cronnos.execute(querySelectLogs)
        return {
            status: "success",
            data: SelectLogs[0]
        }
    }catch(error){
        return {
            status: "error",
            data: error
        }
    }

}

//Função de Insert de novo produto
const InsertProduct = async function(data){

    //Parametros para p Insert
    const nameProduct = data.nameProduct
    const brandProduct = data.brandProduct
    const modelProduct = data.modelProduct
    const description = data.description
    //Construção do Hash 
    const date = new Date()
    const timeStamp = date.getTime().toLocaleString('af-ZA', {timeZone: 'America/Sao_Paulo'})
    const random = Math.random() * 21
    const preHash = crypto.createHash('md5').update(timeStamp + random).digest()
    const hashProduct = preHash.toLocaleString('hex')
    //User Token
    const userToken = data.userToken

    const queryInsertProduct = `INSERT INTO products (name_product, brand_product, model_product, description, hash_product, status) VALUES ('${nameProduct}', '${brandProduct}', '${modelProduct}', '${description}', '${hashProduct}', 1)`

    try{
        const InsertProduct = await connection.cronnos.execute(queryInsertProduct)

        const objLogs = [userToken, 'Produtos', `Novo produto: ${nameProduct}, inserido com sucesso!`, hashProduct]
        InsertLogs(objLogs)

        return {
            status: "success",
            data: InsertProduct[0]
        }
    }catch(error){
        return {
            status: "error",
            data: error
        }
    }

}

//Buscar produto
const SelectProduct = async function(data){

    const status = data.status

    const querySelectProduct = `SELECT * FROM products WHERE status = ${status} ORDER BY name_product ASC`

    try{
        const SelectProduct = await connection.cronnos.execute(querySelectProduct)

        return {
            status: "success",
            data: SelectProduct[0]
        }

    }catch(error){

        return {
            status: "error",
            data: error
        }

    }
}

//Função para isert de logs:
const InsertLogs = async function(data){
    //Contrução de data:
    const date = new Date()
    const dateInsert = date.toLocaleString('af-ZA', {timeZone: 'America/Sao_Paulo'})
    const hash_user = data[0]
    const title = data[1]
    const description = data[2]
    const hashId = data[3]
    const preHashProtocol = crypto.createHash('md5').update(dateInsert + hash_user).digest()
    const hash_protocol = preHashProtocol.toLocaleString('hex')
    const queryLogs = `INSERT INTO logs (date_insert, hash_user, title, description, hash_protocol, hash_id) VALUES ('${dateInsert}', '${hash_user}', '${title}', '${description}', '${hash_protocol}', '${hashId}')`
    const InsertLogs = await connection.cronnos.execute(queryLogs)
}

module.exports = {
    CreateUser,
    SelectUser,
    UpdatePass,
    SelectDataUser,
    AuthUser,
    SelectLogs,
    InsertProduct,
    SelectProduct
};