const {ComponentDialog,TextPrompt,ChoicePrompt,WaterfallDialog}=require('botbuilder-dialogs');
const {ActionTypes,MessageFactory}=require('botbuilder');

const {DateValidator}=require('../validators/DateValidation')

class Appointment extends ComponentDialog
{
    constructor(opt)
    {
        super(opt);
        this.addDialog(new TextPrompt('info', DateValidator));
        this.addDialog(new ChoicePrompt('date'));
        this.addDialog(new TextPrompt('date&time'))
        this.addDialog(new WaterfallDialog('waterfall',[
            this.information.bind(this),
            this.date.bind(this),
            // this.showButtons(this),
            this.bookingConfirmation.bind(this)
        ]))
        this.initialDialogId = 'waterfall';
    }
 
    async information(stepContext){
        return await stepContext.prompt('info',{
            prompt:'You will be able to schedule appointments up to two weeks in advance. Please enter your preferred date with the format (April 09, 2022)',   
        });

    };
    async date(stepContext){
         stepContext.values.date=stepContext.result
        const promptoptions={
            prompt:`Here are the available slots on ${stepContext.result} `,
            
            choices:this.selectDate()
        };
        return stepContext.prompt('date',promptoptions)
    }
   
    selectDate(){
        console.log('select date');
        const cardoptions=[
            {
                value:'10:30 Am',
                synonyms:['10:30 Am']
            },
            {
                value:'12:30 Pm',
                synonyms:['12:30 Pm']
            },
            {
                value:'07:00 pm',
                synonyms:['07:00 Pm']
            }

        ];
       
        return cardoptions; 
    }
    

async bookingConfirmation(stepContext){
        console.log('stepcontext')
        console.log(stepContext.result.value)
        let time=stepContext.result.value
      
await stepContext.context.sendActivity(`Your appointment has been booked at ${time} on  ${stepContext.values.date}`)
const cardactions=[
    {
            title: "Medicine Order status",
            value: "What is the status of my Order",
            type: ActionTypes.ImBack
        },
    {
            "title": "Appointment",
            "value": "Please Schedule an Appointment with Doctor right now",
            type: ActionTypes.ImBack
        }
      ];
      var reply = MessageFactory.suggestedActions(cardactions, 'Would you like to know any other Information');
       await stepContext.context.sendActivity(reply);
       return await stepContext.endDialog();

}
}
module.exports.Appointment=Appointment;