
var Reg=/^(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?)\s+\d{1,2},\s+\d{4}$/;;
async function DateValidator(promptContext){
    console.log(promptContext);
    const res=promptContext.recognized.value;
    const value=Reg.test(res);

    if(value==true){
        return true;
    }
    await promptContext.context.sendActivity(
        'Please enter a valid Date with the preffered Format(April 02, 2022)');
    return false;
}
   
module.exports.DateValidator=DateValidator;