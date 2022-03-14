
async function OrderNumValidator(promptContext){
    console.log("promptContext")
    // console.log(promptContext)
    // if ((promptContext.recognized.value>9999) || (promptContext.recognized.value<1000)) {
    //     console.log(promptContext.recognized.succeeded)
    //     console.log("hello")
    //     await promptContext.context.sendActivity(
    //         'Please enter a valid Order Number which consists only 4 digits');
    //     return false;
    // }
    // return true;

    
    // Check whether the order number is 4 digit Number or not
    var ordernumber= promptContext.recognized.value;
    console.log(ordernumber );
    // console.log(promptContext.options)
    if (ordernumber < promptContext.options.validations.min
        || ordernumber  > promptContext.options.validations.max || isNaN(ordernumber))
         {
        await promptContext.options.retryPrompt;
        return false;
    }

    return true;
}
   
    

module.exports.OrderNumValidator=OrderNumValidator;