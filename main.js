/**
 * This program request two connection strings from the user 
 * using the command line. It is assumed that the user knows 
 * the connection strings before hand.
 * 
 * pre-migriation connectionString: postgresql://old:hehehe@localhost:5432/old
 * post-migration connectionString: postgresql://new:hahaha@localhost:5433/new
 * 
 * 
 * After recieving the user input using a prompt, the arguments given
 * are sent to the "cleaner" methods where they will connect to the database
 * and tested upon. 
 * 
 */

const prompt = require('prompt');
const clean = require('./cleaner');

// Start promt and address user
prompt.start();
console.log("Welcome! \n Please enter the names of the database connection strings \
from the pre and post migration.\n\n");

// Take the input and send it to the startConnections method in cleaner.js
prompt.get(['oldConnectionString', 'newConnectionString'], function (err, result){
    if (err) {return onErr(err)}
    console.log('Connection strings recieved!\n');
    clean.startCleaning(result.oldConnectionString,
                            result.newConnectionString);   
});
// Error handeling could be in place for making sure the user inputs a 
// correct postgres formatted connectionString but since it is assumed 
// they know their dbs this part is skipped.
function onErr(err){
    console.log(err);
    return 1;
}