const customExpress = require('./config/customExpress')
const connection = require('./infrastructure/database/connection')
const Tables = require('./infrastructure/database/tables')


connection.connect(err => {
    if (err) {
        console.log(err)
    } else {
        console.log(`Database connected.`)

        Tables.init(connection)

        const app = customExpress()
        
        app.listen(3050, () => console.log('Server running on port 3050'))
    }
})
