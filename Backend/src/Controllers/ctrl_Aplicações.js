const connection = require('../database/connection');
const crypto = require('crypto');

module.exports = {
    async Crate (request,response){

        const {Comentário} = request.body;

        const { id } = request.params;
        const id_Estudante = request.headers.authorization;

        const DateTime = new Date();

        const verifica_duplicatas = await connection('07_fAplicações')
                                          .where('id_Estudante', id_Estudante)
                                          .select('id')
                                          .timeout(1000)
                                          .first();
        
        if(verifica_duplicatas != null){
            return response.status(409)
                           .json({error: 'Você já enviou uma Aplicação'});
        }
      
        const id_Aplicação = crypto.randomBytes(4).toString('HEX');

        await connection('07_fAplicações').insert({
            id: id_Aplicação,
            Comentário,
            DateTime,
            id_Estudante,
            id_Group: id,
        });

        return response.status(200)
                       .json({resposta: 'Aplicação enviada com sucesso, id: '+ id});
    },

    async List (request, response){

        const { page = 1 } = request.query;
        
        const { id }  = request.params;
        
        const count = await connection('07_fAplicações')
                            .count('*');

        const Aplicação = await connection('07_fAplicações')
                                .join('01_dEstudantes AS E1',
                                      'E1.id',
                                      '=',
                                      '07_fAplicações.id_Estudante')
                                .join('03_dGroups AS E2',
                                      'E2.id',
                                      '=',
                                      '07_fAplicações.id_Group')
                                .limit(10)
                                .offset((page - 1)*10)
                                .where('07_fAplicações.id_Group', id )
                                .select(['07_fAplicações.*',
                                         'E1.Nome',
                                         'E1.Sobrenome',
                                         'E2.Nome'])
                                .timeout(1000);
        
        if(Aplicação == null){
            return response.status(404)
                           .json({error : 'Não foram encontradas Aplicações'})
        }                                

        response.header('X-Total-Count', count['count(*)']);

        return response.json(Aplicação);
    },

    async Delete (request, response){
        const { id } = request.params;
        const id_Estudante = request.headers.authorization;

        const Aplicação = await connection('07_fAplicações')
                                .where('id', id)
                                .select('id_Estudante')
                                .timeout(1000)
                                .first();

        if(Aplicação == null){
            return response.status(404)
                           .json({error: 'A aplicação não foi encontrada'});
        }

        if(Aplicação.id_Estudante != id_Estudante){
            return response.status(401)
                           .json({error: 'Erro de autorização!'});
        };

        await connection('07_fAplicações')
              .where('id', id)
              .delete();

        return response.status(200)
                       .json({Resposta: 'Aplicação deletada com sucesso!'});
    }
}