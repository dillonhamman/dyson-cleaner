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
    console.log(oldDB == newDB);
}


