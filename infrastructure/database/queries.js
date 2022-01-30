const connection = require('./connection')

const executeQuery = (query, parameters = '') => {
    return new Promise ((resolve, reject) => {
        connection.query(query, parameters, (err, results, fields) => {
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
}

module.exports = executeQuery