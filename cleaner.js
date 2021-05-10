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
     * uses a basic query to get two arrays of objects. The 
     * account objects as well as the object created to store 
     * them are also defined in this method. 
     * 
     * @param {string} oldString  - premigration connectionString
     * @param {string} newString  - postmiigration connectionString
     */
    startCleaning: async function(oldString, newString){
        console.log("\n Starting Inspection \n\n");
        
        const oldPool = new Pool({
            connectionString: oldString,
        })
        const newPool = new Pool({
            connectionString: newString,
        })

        // store database contents in arrays 
        const oldDB = await oldPool.query('SELECT * FROM public.accounts');
        const newDB = await newPool.query('SELECT * FROM public.accounts');

        // Create an object to store an array of accounts
        let Accounts = class {
            constructor(){
                this.accounts = [];
            }
            push = function(o){
                this.accounts.push(o);
            } 
            get = function(index){
                return this.accounts[index];
            }
        }

        Accounts.prototype.toString = function () {
            console.log(this.accounts);
        }

        Accounts.prototype.includes = function (o) {
            for (let curr of this.accounts){
                if (curr.id === o.id){
                    return true;
                }
            }
            return false;
        }
        
        // Object for an account, to append into the Accounts object
        let Account = class {
            constructor(id, name, email){
                this.id = id;
                this.name = name;
                this.email = email;
            }
        }
        Account.prototype.equals = function (o) {
            if (this.id === o.id){
                if (this.name === o.name){
                    if (this.email === o.email){
                        return true;
                    }
                }
            }
            return false;
        }
        
        // Create Accounts
        let oldAccounts = new Accounts();
        let newAccounts = new Accounts();

        // Add DB records to Accounts objects.
       for (let row of oldDB.rows){
            oldAccounts.push(new Account(row.id, row.name, row.email));
        }
        for (let row of newDB.rows){
            newAccounts.push(new Account(row.id, row.name, row.email));
        }

        // This block of code walks the user through what the 
        // program is doing and then outputs the findings.

        console.log("Finding Missing Accounts... \n");
        missing = findMissing(oldAccounts, newAccounts);  
        console.log("Done. \n Finding Created Accounts... \n");
        created = findCreated(oldAccounts, newAccounts);
        console.log("Done. \n Finding Corrupted Accounts... \n");
        corrupted = findCorrupted(oldAccounts, newAccounts);
        console.log("Done. \n Missing accounts: \n");
        console.log(missing);
        console.log("\n Created accounts: \n")
        console.log(created);
        console.log("\n Corrupted accounts: \n");
        console.log(corrupted);
    
        
    },  
}

/**
 * This function traverses over the two arrays of objects 
 * and checks to see if each object from the oldDB is in 
 * the newDB. If an original object is not in the new DB
 * it is considered missing.  
 * 
 * Since there are no duplicate IDs, if a ID exist in the 
 * old DB but not the new, it is recorded as missing. 
 * This funciton assumes neither of the DBs are empty.
 * @param {Accounts} oldDB 
 * @param {Accounts} newDB 
 */
function findMissing(oldAccounts, newAccounts){
    const missing = [];
    for (let find of oldAccounts.accounts){
        if (!newAccounts.includes(find)){
            missing.push(find);
        }
    }  
    return missing;
}

// This function is identical to the find method
// but for readability is used.
function findCreated(oldAccounts, newAccounts){
    const created = [];
    for (let find of newAccounts.accounts){
        if (!oldAccounts.includes(find)){
            created.push(find);
        }
    }
    return created;
}

/** 
 * This funciton iterates over the two databases and finds
 * records that have matching IDs, but unidentical data.
 * This would indicate that the record has been corrupted
 * in the migration.
 * 
 * This function returns a 2D array of objects, which
 * is the record ID followed by 
 * the change that happened in the migration. 
 * This funciton assumes neither of the DBs are empty.
 * 
 * Example: 
 *            ID  "Pre"     "Post"
 * output -> [1, "Thomas", "Steven"] indicates 
 * that entity with ID: 1 , originally had the name Thomas 
 * and is now has the name Steven. It also will show 
 * corrupt email entities.
 * @param {Accounts} oldDB 
 * @param {Accounts} newDB 
*/
function findCorrupted(oldAccounts, newAccounts){
    const corrupted = [];
    for (let pre of oldAccounts.accounts){
        for (let post of newAccounts.accounts){
            if (pre.id === post.id){
                if (pre.name != post.name){
                    corrupted.push([pre.id, pre.name, post.name]);
                }
                if (pre.email != post.email){
                    corrupted.push([pre.id, pre.email, post.email]);
                }
            }
        }
    }
    return corrupted;
}
