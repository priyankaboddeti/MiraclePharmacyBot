// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const path = require('path');

const dotenv = require('dotenv');
// Import required bot configuration.
const ENV_FILE = path.join(__dirname, '.env');

dotenv.config({ path: ENV_FILE });

const restify = require('restify');

// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
const {
    CloudAdapter,
    ConfigurationServiceClientCredentialFactory,
    createBotFrameworkAuthenticationFromConfiguration,
    MemoryStorage,
    ConversationState
} = require('botbuilder');

// This bot's main dialog.

const { PharmaBot } = require('./bot');
const { MainDialog } = require('./dialogs/maindialog');

// Create HTTP server
const server = restify.createServer();
server.use(restify.plugins.bodyParser());
// app.use('/public', express.static('images'));
server.listen(process.env.port || process.env.PORT || 3978, () => {
    console.log(`\n${ server.name } listening to ${ server.url }`);
    console.log('\nGet Bot Framework Emulator: https://aka.ms/botframework-emulator');
    console.log('\nTo talk to your bot, open the emulator select "Open Bot"');
});

const credentialsFactory = new ConfigurationServiceClientCredentialFactory({
    MicrosoftAppId: process.env.MicrosoftAppId,
    MicrosoftAppPassword: process.env.MicrosoftAppPassword,
    MicrosoftAppType: process.env.MicrosoftAppType,
    MicrosoftAppTenantId: process.env.MicrosoftAppTenantId
});

const botFrameworkAuthentication = createBotFrameworkAuthenticationFromConfiguration(null, credentialsFactory);

const adapter=new CloudAdapter(botFrameworkAuthentication)
let memoryStorage=new MemoryStorage();
let conversationState=new ConversationState(memoryStorage);
let rootDailog=new MainDialog(conversationState);
let bot=new PharmaBot(conversationState,rootDailog)


adapter.use(async(turncontext,next)=>{
    //pre processing
    turncontext.onSendActivities(async(sendContext,activities,sendNext)=>
    {
      await sendNext()
    })
    await next()
    await conversationState.saveChanges(turncontext,false)
    //post processing
})


adapter.onTurnError = (async (turnContext, error) => {
    console.log(error)
    await turnContext.sendActivity("Oops! some error occured")
    await conversationState.delete(turnContext)
})

// Listen for incoming requests.
server.post('/api/messages', async (req, res) => {
    // Route received a request to adapter for processing)
    await adapter.process(req, res, async (context) =>{
        await bot.run(context)
        // await context.sendActivity("hello")
    })
});


