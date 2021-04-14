const prompt = require('prompt');
const ser = require('./server');
// postgresql://old:hehehe@localhost:5432/old
// postgresql://new:hahaha@localhost:5433/new

prompt.start();

prompt.get(['oldConnectionString', 'newConnectionString'], function (err, result){
    if (err) {return onErr(err)}
    console.log('Connection strings recieved!');
    ser.startConnections(result.oldConnectionString);
    ser.startConnections(result.newConnectionString);
    
    
});
function onErr(err){
    console.log(err);
    return 1;
}