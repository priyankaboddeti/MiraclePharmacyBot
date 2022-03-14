const { QnAMaker } = require("botbuilder-ai")

const QnA1=new QnAMaker({
    "knowledgeBaseId":process.env.QnAKnowledgebaseId,
    "endpointKey":process.env.QnAEndpointKey,
    "host":process.env.QnAEndpointHostName
});
module.exports.QnA = async function (context) {

    const qnaResults = await QnA1.getAnswers(context);
    console.log(qnaResults);
    if (qnaResults.length>0) {
        await context.sendActivity(qnaResults[0].answer);
    
    // If no answers were returned from QnA Maker, reply with help.
    } else {
        await context.sendActivity("I'm afraid i dont know how to help you with that...");
    }
   
   
};

