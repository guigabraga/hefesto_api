const crypto = require('crypto')
const connection = require('./connection')

const InsertSession = async function(){

    //Criação de data:
    const date = new Date()
    const dateInsert = date.toLocaleString('af-ZA', {timeZone: 'America/Sao_Paulo'})
    //Criação de hash:
    const timeStamp = date.getTime().toLocaleString('af-ZA', {timeZone: 'America/Sao_Paulo'})
    const random = Math.random() * 21
    const preHash = crypto.createHash('md5').update(timeStamp + random).digest()
    const hashSession = preHash.toLocaleString('hex')

    const queryInsertSession = `INSERT INTO sessions (date_session, id_hash_session, auth_session) VALUES ('${dateInsert}', '${hashSession}', 1)`

    try{
        const InsertSession = await connection.artemis.execute(queryInsertSession)

        //Insert de Step:
        const dataInsertStap = [0, hashSession, dateInsert]
        InsertStep(dataInsertStap)

        return {
            status: "success",
            required: {
                step: 0,
                userToken: hashSession,
                message: ""
            },
        }
    }catch(error){
        return {
            status: "error",
            data: error
        }
    }

}

const SelectSessionStep = async function(data){

    //Criação de data:
    const date = new Date()
    const dateInsert = date.toLocaleString('af-ZA', {timeZone: 'America/Sao_Paulo'})

    const userToken = data.userToken
    const userMessage = data.message

    const querySelectSessionStep = `SELECT sessions.id_hash_session, steps.step, steps.date_step, sessions.auth_session FROM sessions INNER JOIN steps ON sessions.id_hash_session = steps.id_hash_session WHERE sessions.id_hash_session = '${userToken}' ORDER BY steps.date_step DESC LIMIT 1`

    try{
        const SelectSessionStep = await connection.artemis.execute(querySelectSessionStep)

        if(SelectSessionStep[0].length > 0){

            const authSession = SelectSessionStep[0][0].auth_session 

            if(authSession === 1){

                const step = SelectSessionStep[0][0].step 

                if(step === 0){

                    const message = "Show! Agora, Me fale seu nome..."

                    //Insert de Step:
                    const dataInsertStap = [1, userToken, dateInsert]
                    InsertStep(dataInsertStap)

                    //Insert Message:
                    const objInsertMessage = [dateInsert, message, userToken, 0]
                    InsertMessage(objInsertMessage)

                    return {
                        status: "success",
                        step: 0,
                        message: message,
                        data: SelectSessionStep[0]
                    }

                }else if(step === 1){

                    const message = `Olá ${userMessage}, tudo bem? Bom, estou apta a te ajudar com as seguintes opçoes: Digite apenas o número delas ok?\n 1 - Continuar comigo\n 2 - Falar com atendente.`

                    //Insert de Step:
                    const dataInsertStap = [2, userToken, dateInsert]
                    InsertStep(dataInsertStap)

                    //Insert Message User:
                    const objInsertMessageUser = [dateInsert, userMessage, userToken, 1]
                    InsertMessage(objInsertMessageUser)

                    //Insert Message Artemis:
                    const objInsertMessage = [dateInsert, message, userToken, 0]
                    InsertMessage(objInsertMessage)

                    return {
                        status: "success",
                        step: 1,
                        message: message,
                        data: SelectSessionStep[0]
                    }

                }else if(step === 2){
                    
                }

            }else if(authSession === 2){
                return {
                    status: "success",
                    message: "Sua sessão expirou.",
                    data: SelectSessionStep[0]
                }
            }
        }else{

        }

    }catch(error){
        return {
            status: "error",
            data: error
        }
    }
}

const InsertStep = async function(data){
    
    const queryInsertStep = `INSERT INTO steps (step, id_hash_session, date_step) VALUES ('${data[0]}', '${data[1]}', '${data[2]}')`

    const InsertStap = await connection.artemis.execute(queryInsertStep)
}

const InsertMessage = async function(data){

    //Criação de hash:
    const date = new Date()
    const timeStamp = date.getTime().toLocaleString('af-ZA', {timeZone: 'America/Sao_Paulo'})
    const random = Math.random() * 21
    const preHash = crypto.createHash('md5').update(timeStamp + random).digest()
    const hashMessage = preHash.toLocaleString('hex')

    const queryInsertMessage = `INSERT INTO messages (date_message, message, id_hash_message, id_hash_session, author) VALUES ('${data[0]}', '${data[1]}', '${hashMessage}', '${data[2]}', '${data[3]}')`

    const InsertMessage = await connection.artemis.execute(queryInsertMessage)

}

const GetConversation = async function(data){
    const userToken = data.userToken

    const queryGetConversation = `SELECT * FROM messages WHERE id_hash_session = '${userToken}'`
    try{
        const GetConversation = await connection.artemis.execute(queryGetConversation)
        return {
            status: "success",
            data: GetConversation[0]
        }
    }catch(error){
        return {
            status: "error",
            data: error
        }
    }
}

module.exports = {
    InsertSession,
    SelectSessionStep,
    GetConversation
}