const { Pool } = require('pg');


module.exports = {
    startConnections: async function(oldString, newString){
        const oldPool = new Pool({
            connectionString: oldString,
        })
        const newPool = new Pool({
            connectionString: newString,
        })
        var oldDB = await oldPool.query('SELECT * FROM accounts', []);
        var newDB = await newPool.query('SELECT * FROM accounts', []);
        return (compareDBs(oldDB, newDB));
    },  
}


function compareDBs(oldDB, newDB) {
    compareSizes(oldDB, newDB); 
}

function compareSizes(oldDB, newDB){
    if (oldDB.rowCount == newDB.rowCount){
        return console.log("No accounts were lost in the migration.\n");
    } else if (oldDB.rowCount > newDB.rowCount){
        console.log(oldDB.rowCount, newDB.rowCount);
        return console.log((oldDB.rowCount - newDB.rowCount),
                'account(s) were missed in the migration.');
        // TODO: find missing record
    } else {
        return console.log("Accounts were created during the migration.\n");
    }
}

function findMissingRecords(oldDB, newDB){

}




