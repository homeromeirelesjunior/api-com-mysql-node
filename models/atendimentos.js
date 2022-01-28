const moment = require('moment')

const connection = require('../infrastructure/connection')

class Atendimento {
    add(atendimento, res) {
        // Formatação da data
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
        
        // Validações
        const dataValida = moment(data).isSameOrAfter(dataCriacao)
        const clienteValido = atendimento.cliente.length >= 5
        
        const validacoes = [
            {
                nome: 'data',
                valido: dataValida,
                message: 'Data deve ser maior ou igual a data atual.'
            },
            {
                nome: 'cliente',
                valido: clienteValido,
                message: 'Cliente deve ter pelo menos 5 caracteres'
            }
        ]
        
        const erros = validacoes.filter(campo => !campo.valido)
        const existemErros = erros.length

        if (existemErros) {
            res
                .status(400)
                .json(erros)
        } else {
            const atendimentoDatado = {...atendimento, dataCriacao, data}
            
            const sql = 'INSERT INTO atendimentos SET ?'
    
            connection.query(sql, atendimentoDatado, (err, result) => {
                if (err) {
                    res
                        .status(400)
                        .json(err)
                } else {
                    res
                        .status(201)
                        .json(atendimento)
                }
            })
        }

    }

    list(res) {
        const sql = 'SELECT * FROM atendimentos'

        connection.query(sql, (err, result) => {
            if (err) {
                res
                    .status(400)
                    .json(err)                
            } else {
                res
                    .status(200)
                    .json(result)
            }
        })
    }

    getId(id, res) {
        const sql = `SELECT * FROM atendimentos WHERE id = ${id}`

        connection.query(sql, (err, result) => {
            const atendimento = result[0]

            if (err) {
                res
                    .status(400)
                    .json(err)
            } else {
                res
                    .status(200)
                    .json(atendimento)
            }
        })
    }

    update(id, values, res) {
        if (values.data) {
            values.data = moment(values.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')
        }

        const sql = 'UPDATE atendimentos SET ? WHERE id = ?'

        connection.query(sql, [values, id], (err, result) => {
            if(err) {
                res
                    .status(400)
                    .json(err)
            } else {
                res
                    .status(200)
                    .json({ ...values, id })
            }
        })
    }

    delete(id, res) {
        const sql = 'DELETE FROM atendimentos WHERE id = ?'

        connection.query(sql, id, (err, result) => {
            if(err) {
                res
                    .status(400)
                    .json(err)
            } else {
                res
                    .status(200)
                    .json({ id })
            }
        })
    }
}

module.exports = new Atendimento