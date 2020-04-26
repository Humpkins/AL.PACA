const connection = require('../database/connection');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

module.exports = {
    async Create (request, response) {
        
        const saltRounds = 10;
        
        const {Nome_fantasia,
               senha,
               Ramo,
               CNPJ,
               Email,
               Telefone,
               id_Local} = request.body;

        const id = crypto.randomBytes(4).toString('HEX');

        await bcrypt.hash(senha, saltRounds, async function(err, hash){

            await connection('02_dEmpresas').insert({
                id,
                Nome_fantasia,
                senha: hash,
                Ramo,
                CNPJ,
                Email,
                Telefone,
                id_Local,
            });

        });

        return response.json({Resposta: 'Empresa criada com sucesso! id:' + id});
        
    },

    async List (request, response){

        const { page = 1} = request.query;

        const count = await connection('02_dEmpresas')
                            .count('*');
        
        const Empresas = await connection('02_dEmpresas')
                               .limit(10)
                               .offset((page - 1)*10)
                               .select('*')
                               .timeout(1000);

        response.header('X-Total-Count', count['count(*)']);

        return response.json(Empresas);
    }
}