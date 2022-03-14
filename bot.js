const {ActivityHandler}=require('botbuilder')
const { CardFactory } = require('botbuilder-core');

class PharmaBot extends ActivityHandler{
    constructor(conversationState,rootDialog){
       super();
       this.conversationState=conversationState;
       this.dialog=rootDialog;
       this.dialogState=this.conversationState.createProperty('dialog')
      
       this.onMembersAdded(async (context, next) => {
        const membersAdded = context.activity.membersAdded;
        for (let cnt = 0; cnt < membersAdded.length; cnt++) {
            if (membersAdded[cnt].id !== context.activity.recipient.id) {
                
                let heroCard = CardFactory.heroCard(`Welcome to Miracle Pharmacy Chatbot...! `, 
                CardFactory.images([`https://transcode-v2.app.engoo.com/image/fetch/f_auto,c_lfill,w_300,dpr_3/https://assets.app.engoo.com/images/HjnmgIKJXcn2eG2FyZbvukCARnINNub5Qw5tDRXrngY.jpeg`]), 
                CardFactory.actions([
                
                    {
                        "title": "Order Status",
                        "value": "What is the Status of My order",
                        "type": "imBack"
                    },
                    {
                        "title": "Schedule Appointment",
                        "value": "Can you please Book an appointment Today",
                        "type": "imBack"
                    },
                    {
                        "title":"Store Timings",
                        "value":"what are the opening and closing hours of the store?",
                        "type":"imBack"
                    },
                    {
                        "title":"Store Location",
                        "value":"can i know your store location ?",
                        "type":"imBack"
                    }
                ])
                // console.log(heroCard)
                );
                await context.sendActivity({ attachments: [heroCard] });
            }
        }
        await next();
    });
        this.onMessage(async(context,next)=>{
            console.log("pharmabot")
            await this.dialog.run(context, this.dialogState);
            await next()
        });
    }

}


module.exports.PharmaBot=PharmaBot







// const fs = require('fs');
// var base64Img = require('base64-img');

// function encodeBase64(path) {
                //     const bitmap = fs.readFileSync(path);
                //     return new Buffer(bitmap).toString('base64')
                // }
                // var data =base64Img.base64Sync('../public/Mircale_Pharma_Logo.png');
                // console.log(data)
                // await context.sendActivity(data)