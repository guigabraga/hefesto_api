const ModalCronnosDb = require('../models/ModelCronnosDb')
const io = require('@pm2/io')

//Função para criação de usuário
const CreateUser = async function(req, res){
    const DataBody = req.body
    //Validação de Nome
    if(DataBody.name != null && DataBody.name.length > 0){
        nameValidation = true
        nameValue = DataBody.name
    }else{
        nameValidation = false
        nameValue = "invalid"
    }
    //Validação de Email
    if(DataBody.email != null && DataBody.email.length > 0){
        emailValidation = true
        emailValue = DataBody.email
    }else{
        emailValidation = false
        emailValue = "invalid"
    }
    //Validação do Tipo de Usuário
    if(DataBody.userType != null && DataBody.userType === "1" || DataBody.userType === "2"){
        userTypeValidation = true
        userTypeValue = DataBody.userType
    }else{
        userTypeValidation = false
        userTypeValue = "invalid"
    }
    //Validação de senha
    if(DataBody.pass != null && DataBody.pass.length > 5){
        passValidation = true
        passValue = DataBody.pass
    }else{
        passValidation = false
        passValue = "invalid"
    }
    //Resposta
    if(nameValidation && emailValidation && userTypeValidation && passValidation === true){
        const CreateUser = await ModalCronnosDb.CreateUser(DataBody)
        if(CreateUser.status === "success"){
            return res.status(201).json({
                status: "success",
                message: "Usuário criado com sucesso!"
            });
        }else if(CreateUser.status === "error"){
            return res.status(400).json({
                status: "error",
                message: CreateUser.msg.code
            });
        }else{
            return res.status(400).json({
                status: "error",
                message: "Um erro inesperado aconteceu!"
            });
        }
    }else{
        return res.status(400).json({
            status: "error",
            name: nameValidation,
            email: emailValidation,
            userType: userTypeValidation,
            pass: passValidation
        });
    }
};

const SelectUser = async function(req, res){
    const DataBody = req.body
    emailValue = DataBody.email
    const SelectUser = await ModalCronnosDb.SelectUser(DataBody)
    return res.status(201).json({
        status: "success",
        message: SelectUser.msg
    })
}

const UpdatePass = async function(req, res){
    const DataBody = req.body
    if(DataBody.email != null && DataBody.email.length > 0){
        emailValidation = true
        emailValue = DataBody.email
    }else{
        emailValidation = false
        emailValue = "invalid"
    }
    if(DataBody.pass != null && DataBody.pass.length > 5){
        passValidation = true
        passValue = DataBody.pass  
    }else{
        passValidation = false
        passValue = "invalid"
    }
    if(DataBody.hashUser != null && DataBody.hashUser.length > 5){
        hashUserValidation = true
        hashUserValue = DataBody.hashUser  
    }else{
        hashUserValidation = false
        hashUserValue = "invalid"
    }
    if(emailValidation && hashUserValidation && passValidation === true){
        const UpdatePass = await ModalCronnosDb.UpdatePass(DataBody)
        if(UpdatePass.status === "success"){
            return res.status(201).json({
                status: "success",
                message: "Senha alterada com sucesso!"
            });
        }else if(UpdatePass.status === "error"){
            return res.status(400).json({
                status: "error",
                message: UpdatePass.msg.code
            });
        }else{
            return res.status(400).json({
                status: "error",
                message: "Um erro inesperado aconteceu!"
            });
        }
    }else{
        return res.status(400).json({
            status: "error",
            email: emailValidation,
            pass: passValidation,
            hashUser: hashUserValidation
        });
    }
}

//Função para buscar dados do usuário:
const SelectDataUser = async function(req, res){
    try{
        const DataBody = req.body
        emailValue = DataBody.email
        const SelectDataUser = await ModalCronnosDb.SelectDataUser(DataBody)
        if(SelectDataUser.data[0][0] != undefined){
            const dataSelect = {"idusers": SelectDataUser.data[0][0].idusers, "name": SelectDataUser.data[0][0].name, "email": SelectDataUser.data[0][0].email, "hashUser": SelectDataUser.data[0][0].hashUser}
            return res.status(201).json({
                status: "success",
                data: dataSelect
            })
        }else{
            return res.status(400).json({
                status: "error",
                data: "email nao localizado"
            })
        }
    }catch(e){
        return res.status(400).json({
            status: "error",
            data: e
        })
    }

}

//Função para autenticar usuário:
const AuthUser = async function(req, res){
    //Construção de data para log:
    const date = new Date()
    const dateInsert = date.toLocaleString('af-ZA', {timeZone: 'America/Sao_Paulo'})
    try{
        //Json com os parametros de email e pass:
        const authUserData = req.body
        //Resposta do Model:
        const AuthUser = await ModalCronnosDb.AuthUser(authUserData)
        //Condições para autenticação:
        if(AuthUser.status === "success"){
            //Condição para validar se existe dato a ser retornado:
            if(AuthUser.data[0].length > 0){
                //Retorno de sucesso:
                console.log("date: " + dateInsert + " | status: success | msg: usuario autenticado com sucesso | token: " + AuthUser.data[0][0].hashUser +", auth: true | nameUser: " + AuthUser.data[0][0].name)
                return res.json({
                    status: "success",
                    msg: "usuario autenticado com sucesso",
                    token: AuthUser.data[0][0].hashUser,
                    auth: true,
                    nameUser: AuthUser.data[0][0].name
                })
            }else{
                //Retorno de erro:
                io.notifyError(new Error('AuthUser: Usuário não validado'))
                return res.json({
                    status: "error",
                    msg: "usuario nao validado",
                    token: false,
                    auth: false
                })
            }
        }else{
            io.notifyError(new Error('AuthUser: Erro ao acessar o banco de dados'))
            //Retorno de erro:
            return res.json({
                status: "error",
                msg: "erro ao acessar o banco de dados",
                token: false,
                auth: false
            })
        }
    }catch(e){
        //Notificação no pm2
        io.notifyError(new Error('AuthUser: ' + e))
        return res.json({
            //Retorno de erro:
            status: "error",
            msg: e,
            token: false,
            auth: false
        })
    }  
}

module.exports = {
    CreateUser,
    SelectUser,
    UpdatePass,
    SelectDataUser,
    AuthUser
}