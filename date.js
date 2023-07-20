    /// We can move this date logic from expreess app.js server into its own module 
// exports function

// more cleaner way for code
exports.getDate = getDate;

var getDate = function (){ 

    const today = new Date();



    const options = {
        weekday:'long',
        month: 'long',
        day: 'numeric'
    };

    return today.toLocaleDateString("en-US",options); 

}

module.exports.getDay = getDay;

function getDay(){ 

    let today = new Date();



    var options = {
        weekday:'long',
  
    };

    return today.toLocaleDateString("en-US",options); 

}

