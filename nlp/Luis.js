
const {LuisRecognizer}=require('botbuilder-ai')
const luisRecognizer = new LuisRecognizer({
    "applicationId": "b9841e98-cd13-48b6-992f-6295e36dfbe5",
    "endpoint": "https://westus.api.cognitive.microsoft.com",
    "endpointKey": "13be82d0d40f437997152bb7b6673898"
}, {
    "includeAllIntents": true,
})


module.exports.luisRecognizer = async function (context) {

    const luisResult = await luisRecognizer.recognize(context);
    console.log(luisResult)
    const intent = LuisRecognizer.topIntent(luisResult);

    console.log(intent)
    return {
        intent: intent,
        
    };
};


// const luisRecognizer = new LuisRecognizer(luisApplication, luisPredictionOptions, true);
//             const recognizerResult = await luisRecognizer.recognize(context);
//             console.log("Inside luis recognizer", recognizerResult.luisResult.prediction.topIntent)
//             // const intent = LuisRecognizer.topIntent(luisRecognizer);
//             const intent = recognizerResult.luisResult.prediction.topIntent