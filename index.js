const customExpress = require('./config/customExpress')
const connection = require('./infrastructure/connection')
const Tables = require('./infrastructure/tables')


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
