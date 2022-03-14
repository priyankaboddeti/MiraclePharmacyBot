const {
    ComponentDialog,
    DialogSet,
    DialogTurnStatus,
    WaterfallDialog,
    
} = require("botbuilder-dialogs");

const { OrchestratorRecognizer } = require("botbuilder-ai-orchestrator");
const {LuisRecognizer}=require('botbuilder-ai')

const{luisRecognizer}=require('../nlp/Luis')
const { QnA } = require("../nlp/QnA");

const {MedicineOrderStatus}=require('./MedicineOrderStatus')
const{Appointment}=require('./Appointment');

class MainDialog extends ComponentDialog {
    constructor() {
        super("maindialog");
        
       this.dispatchRecognizer = new OrchestratorRecognizer().configure({
        modelFolder: process.env.ModelFolder,
        snapshotFile: process.env.SnapshotFile,
    });

        this.addDialog(new MedicineOrderStatus('order'));
        this.addDialog(new Appointment('appointment'));
        this.addDialog(
            new WaterfallDialog("waterfall", [
                this.initStep.bind(this),
            ])
        );
        this.initialDialogId = "waterfall";
    }

    async initStep(stepContext) {
        console.log("initstep")
        const recognizerResult = await this.dispatchRecognizer.recognize(stepContext,stepContext.context.activity);
            console.log(recognizerResult);
            const intent = LuisRecognizer.topIntent(recognizerResult);
            console.log(intent)
            if(intent=="QnAMaker"){
                await QnA(stepContext.context)
                return await stepContext.endDialog();
            }   
            else if(intent=="Miracle Pharma Bot (1)")
            {
                const luisResult=await luisRecognizer(stepContext.context)
                console.log(luisResult)
                if(luisResult.intent=="Medicine_order_status")
                {
                return await stepContext.beginDialog('order');
                }
                else if(luisResult.intent=="Schedule_Appointment")
                {
                    return await stepContext.beginDialog('appointment')
                }
                else if(luisResult.intent=="store_location"){
                    await stepContext.context.sendActivity("Miracle Pharma store location is Near Farmington hills");
                    return await stepContext.endDialog();
                }
                else if(luisResult.intent=="store_timings"){
                   await stepContext.context.sendActivity("Thank you for your Interest...! \n The store is available between 10 AM to 9 PM");
                    return await stepContext.endDialog();
                }
                else if(luisResult.intent=="Greets"){
                    await stepContext.context.sendActivity("Hello there, How can i help you ?");
                    return await stepContext.endDialog();
                }    
            }
          
           else(luisResult.intent=="None")
                {
                    await stepContext.context.sendActivity("I'm afraid i dont know how to help you with that...");
                    return await stepContext.endDialog();
                } 
            }

    async run(context, stateAccesor) {
        // console.log(context);
        // console.log(stateAccesor);
        let dialogset = new DialogSet(stateAccesor);
        dialogset.add(this);

        let dc = await dialogset.createContext(context);
        //  console.log(dc)
        let dialogStatus = await dc.continueDialog();
        // console.log(dialogStatus);
        
        if (dialogStatus.status == DialogTurnStatus.empty) {
            //  console.log(this.id)
            await dc.beginDialog(this.id);
        }
    }
}
module.exports.MainDialog = MainDialog;
