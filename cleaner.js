const { Pool } = require('pg')
//'postgresql://old:hehehe@localhost:5432/old'

module.exports = {
    setRec: function(records){
        recordsArr = records;
        return recordsArr;
    },
    startConnections: function(oldString, newString){
        const oldPool = new Pool({
            connectionString: oldString,
        })
        const newPool = new Pool({
            connectionString: newString,
        })
        oldPool.query('SELECT * FROM accounts', (err, res) => {
            if (err) throw err;
            console.log(res);
        })
        newPool.query('SELECT * FROM accounts', (err, res) => {
            if (err) throw err;
            console.log(res);
        });
    }
}