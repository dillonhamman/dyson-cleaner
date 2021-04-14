const { Pool } = require('pg')
//'postgresql://old:hehehe@localhost:5432/old'

module.exports = {
    setRec: function(records){
        recordsArr = records;
        return recordsArr;
    },
    startConnections: function(connectionString){
        const pool = new Pool({
            connectionString,
        })
        pool.query('SELECT * FROM accounts', (err, res) => {
            if (err) throw err;
            console.log(res);
        });
    }
}