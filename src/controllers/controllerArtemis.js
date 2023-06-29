const ModelArtemis = require('../models/ModelArtemis')

//Fluxo:
const FlowArtemis = async function(req, res){
    try{
        const dataFlow = req.body
        //Step 0
        if(dataFlow.userToken){
            const SelectSessionStep = await ModelArtemis.SelectSessionStep(dataFlow)

            const message = SelectSessionStep.message
            const step = SelectSessionStep.step

            return res.status(201).json({
                artemis: {
                    step: step,
                    message: message
                }
            }) 

        }else{
            const InsertSession = await ModelArtemis.InsertSession()
    
            return res.status(201).json({
                artemis: {
                    data: InsertSession,
                    message: "Olá, sou Artemis! Sua assistente virtual! Digite ok para continuarmos..."
                }
                
            })
        }
    }catch(e){
        return res.status(400).json({
            data: e
        })
    }

}

//Pegar conversas:
const GetConversation = async function(req, res){
    try{
        const dataConversation = req.body
        
        if(dataConversation.userToken){
            const GetConversation = await ModelArtemis.GetConversation(dataConversation)
            return res.status(200).json({
                data: GetConversation
            }) 

        }else{
            return res.status(400).json({
                data: "error"
            }) 
        }
    }catch(e){
        return res.status(400).json({
            data: e
        })
    }
}

module.exports = {
    FlowArtemis,
    GetConversation
}