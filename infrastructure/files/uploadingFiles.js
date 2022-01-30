const fs = require('fs')
const path = require('path')

module.exports = (caminho, fileName, callbackImageCreated) => {
    const tipo = path.extname(caminho)
    const tiposValidos = ['jpg', 'png', 'jpeg']
    const tipoEhValido = tiposValidos.indexOf(tipo.substring(1)) !== -1
    
    if (!tipoEhValido) {
        const err = 'Tipo é inváalido'
        console.log('Erro, tipo inválido')

        callbackImageCreated(err)
    } else {
        const newPath = `./assets/images/${fileName}${tipo}`
        
        fs.createReadStream(caminho)
            .pipe(fs.createWriteStream(newPath))
            .on('finish', () => callbackImageCreated(false, newPath))
    }
}


