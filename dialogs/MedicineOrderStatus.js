const {ComponentDialog,NumberPrompt,ChoicePrompt,WaterfallDialog}=require('botbuilder-dialogs');
const {ActionTypes,MessageFactory}=require('botbuilder');
const{OrderNumValidator}=require('../validators/OrderValidation')  
class MedicineOrderStatus extends ComponentDialog
{
  constructor(id){
      super(id); 
      this.addDialog(new NumberPrompt('AskOrderNum',OrderNumValidator));
      this.addDialog(new ChoicePrompt('ConfirmOrderNum'));
      this.addDialog(new WaterfallDialog('waterfall',[
          this.AskorderNum.bind(this),
          this.ConfirmOrdNum.bind(this),
        
      ]))
      this.initialDialogId = 'waterfall'
  }
  
  async AskorderNum(stepContext){
    console.log("entered");
        return await stepContext.prompt ('AskOrderNum',{
          prompt: 'Please provide your order Number.',
           retryPrompt:'Please enter a valid Order Number which consists only 4 digits',
          validations:{min:1000,max:9999},
        });
        
        };

      async ConfirmOrdNum(stepContext){
        console.log('maindialog.ConfirmOrderNum');
        // console.log(stepContext.context)
        
        await stepContext.context.sendActivity('The order is in transit, please expect to receive it by April 1st')
        const cardactions=[
          {
                  title: "Medicine Order status",
                  value: "What is the status of my Order",
                  type: ActionTypes.ImBack
              },
              {
                  "title": "Appointment",
                  "value": "can you please schedule an appointment today",
                  type: ActionTypes.ImBack
              }
            ];
            var reply = MessageFactory.suggestedActions(cardactions, 'Would you like to know any other Information');
             await stepContext.context.sendActivity(reply);
             return await stepContext.endDialog();
      }  
}
module.exports.MedicineOrderStatus=MedicineOrderStatus;
