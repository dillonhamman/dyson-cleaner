/**
 * cleaner.js
 * 
 * This file uses connectionString given by the user to connect to the 
 * postgresql databases. It then runs comparative methods on the 
 * databases. 
 */
const { Pool } = require('pg');


module.exports = {
    /**
     * This async function creates the connections and then
     * uses a basic query to get two arrays of objects. 
     * 
     * @param {string} oldString  - premigration connectionString
     * @param {string} newString  - postmiigration connectionString
     */
    startCleaning: async function(oldString, newString){
        const oldPool = new Pool({
            connectionString: oldString,
        })
        const newPool = new Pool({
            connectionString: newString,
        })
        // store database contents in arrays 
        var oldDB = await oldPool.query('SELECT * FROM public.accounts', []);
        var newDB = await newPool.query('SELECT * FROM public.accounts', []);
        compareSizes(oldDB, newDB);
    },  
}
/**
 * This method traverses over the two arrays of objects 
 * and checks to seeif each object from the oldDB is in 
 * the newDB. 
 * @param {array} oldDB 
 * @param {array} newDB 
 */
function findMissing(oldDB, newDB){

    
}

/**
 * This funciton takes in two database instances [list of objects]
 * and compares the sizes of them. 
 * 
 * @oldDB - the premigration database
 * @newDB - the postmigration database
 * 
 * @return a console log explainging the comparison,
 *              also if necessary, a call to another funciton
 */
function compareSizes(oldDB, newDB){
    // Check if they are the same size 
    if (oldDB.rowCount == newDB.rowCount){
        return console.log("No accounts were lost in the migration.\n");
        // Check if oldDB is greater than newDB
    } else if (oldDB.rowCount > newDB.rowCount){
        console.log('pre-', oldDB.rowCount, 'post-', newDB.rowCount , "\n");
        console.log((oldDB.rowCount - newDB.rowCount),
                'account(s) were missed in the migration.');
                findMissing(oldDB, newDB);
    } else {
        // newDB is greater than oldDB
        return console.log("Accounts were created during the migration.\n\n\n\n");
    }
}






