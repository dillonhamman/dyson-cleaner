const prompt = require('prompt');
const clean = require('./cleaner');
// postgresql://old:hehehe@localhost:5432/old
// postgresql://new:hahaha@localhost:5433/new

prompt.start();

prompt.get(['oldConnectionString', 'newConnectionString'], function (err, result){
    if (err) {return onErr(err)}
    console.log('Connection strings recieved!');
    clean.startConnections(result.oldConnectionString, result.newConnectionString);
    
    
});
function onErr(err){
    console.log(err);
    return 1;
}