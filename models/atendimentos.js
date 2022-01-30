const moment = require('moment')
const axios = require('axios')

const connection = require('../infrastructure/database/connection')
const repository = require('../repositories/atendimento')

class Atendimento {
    constructor() {
        // Validações
        this.dataValida = ({ data, dataCriacao }) => moment(data).isSameOrAfter(dataCriacao)
        this.clienteValido = (tamanho) => tamanho.length >= 5

        this.valida = (parametros) => 
            this.validacoes.filter(campo => {
                const { nome } = campo
                const parametro = parametros[nome]

                return !campo.valido(parametro)
            })

        this.validacoes = [
            {
                nome: 'data',
                valido: this.dataValida,
                message: 'Data deve ser maior ou igual a data atual.'
            },
            {
                nome: 'cliente',
                valido: this.clienteValido,
                message: 'Cliente deve ter pelo menos 5 caracteres'
            }
        ]

    }

    add(atendimento) {
        // Formatação da data
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
        const data = moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS')

        const parametros = {
            data: { data, dataCriacao },
            cliente: { tamanho: atendimento.cliente.length }
        }

        const erros = this.valida(parametros)
        const existemErros = erros.length

        if(existemErros) {
            return new Promise ((resolve, reject) => 
            reject(erros))

        } else {
            const atendimentoDatado = { ...atendimento, dataCriacao, data }
        
            return repository.add(atendimentoDatado)
                .then(results => {
                    const id = results.insertId
                    return { ...atendimento, id }
                })            
        }
    }

    list() {
        return repository.list()
    }

    getId(id, res) {
        const sql = `SELECT * FROM atendimentos WHERE id = ${id}`

        connection.query(sql, async (err, result) => {
            const atendimento = result[0]
            const cpf = atendimento.cliente

            if (err) {
                res
                    .status(400)
                    .json(err)
            } else {
                const { data } = await axios.get(`http://localhost:8082/${cpf}`)

                atendimento.cliente = data

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