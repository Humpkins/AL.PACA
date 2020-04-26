const connection = require('../database/connection');

const crypto = require('crypto');

const bcrypt = require('bcrypt');

module.exports = {
    async Create (request, response){
        
        const saltRounds = 10;

        const {Nome,
               Sobrenome,
               senha,
               CPF,
               Periodo,
               Email,
               Telefone,
               id_Universidade,
               id_Curso,
               id_Local,
               id_Group} = request.body;

        const id = crypto.randomBytes(5).toString('HEX');
   
        await bcrypt.hash(senha, saltRounds, async function(err, hash) {

                await connection('01_dEstudantes').insert({
                    id,
                    Nome,
                    Sobrenome,
                    senha: hash,
                    CPF,
                    Periodo,
                    Email,
                    Telefone,
                    id_Universidade,
                    id_Curso,
                    id_Local,
                    id_Group,
                })
        });

        return response.json({resposta: 'Enviado com sucesso id n:' + id});
    },

    async List (request, response){

        const { page = 1} = request.query;

        const [ count ] = await connection('01_dEstudantes').count();
        
        const Estudantes = await connection('01_dEstudantes')
                                 .limit(10)
                                 .offset((page - 1)*10)
                                 .select('*')
                                 .from('01_dEstudantes')
                                 .timeout(1000);
        
        response.header('X-Total-Count', count['count(*)']);

        return response.json(Estudantes);
    }
}