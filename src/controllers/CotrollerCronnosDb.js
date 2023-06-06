const ModalCronnosDb = require('../models/ModelCronnosDb')

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

const SelectDataUser = async function(req, res){
    const DataBody = req.body
    emailValue = DataBody.email
    const SelectDataUser = await ModalCronnosDb.SelectDataUser(DataBody)
    if(SelectDataUser.data[0][0] != undefined){
        return res.status(201).json({
            status: "success",
            data: SelectDataUser.data[0][0]
        })
    }else{
        return res.status(400).json({
            status: "erro",
            data: "email nao localizado"
        })
    }

}

module.exports = {
    CreateUser,
    SelectUser,
    UpdatePass,
    SelectDataUser
}