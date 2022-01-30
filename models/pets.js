const connection = require('../infrastructure/database/connection')
const uploadFiles = require('../infrastructure/files/uploadingFiles')

class Pet {
    add(pet, res) {
        const sql = 'INSERT INTO pets SET ?'

        uploadFiles(pet.imagem, pet.nome, (erro, newPath) => {
            if (erro) {
                res
                    .status(400)
                    .json({ erro })
            } else {
                const newPet = {nome: pet.nome, imagem: newPath}
    
                connection.query(sql, newPet, err => {
                    if(err) {
                        res
                            .status(400)
                            .json(err)
                    } else {
                        res
                            .status(200)
                            .json(newPet)
                    }
                })
            }
        })
    }
}

module.exports = new Pet