const connection = require('../database/connection');
const crypto = require('crypto');

module.exports = {
    async Create (request, response){
        
        const {Comentário,
               Duração,
               dim_Duração,
               Orçamento} = request.body;

        const { id } = request.params;

        const id_Group = request.headers.group;
        const id_Diretor = request.headers.authorization;
        
        const DateTime = new Date();

        const Verifica_Diretoria = await connection('03_dGroups')
                                   .where('id', id_Group)
                                   .select('id_Diretor')
                                   .timeout(1000)
                                   .first();
                      
        if(Verifica_Diretoria == null){
            return response.status(404).json({error: 'Grupo não encontrado'});
        }

        if(Verifica_Diretoria.id_Diretor != id_Diretor){
            return response.status(401).json({error: 'Erro de autorização'});
        }

        const verifica_duplicatas = await connection('06_fPropostas')
                                          .where('id_Group', id_Group)
                                          .select('id')
                                          .timeout(1000)
                                          .first();
        
        if(verifica_duplicatas != null){
            return response.status(409).json({error: 'Você já enviou uma Proposta'});
        }

        const id_Proposta = crypto.randomBytes(4).toString('HEX');

        await connection('06_fPropostas').insert({
            id : id_Proposta,
            Comentário,
            DateTime,
            Duração,
            dim_Duração,
            Orçamento,
            id_Group,
            id_Projeto : id,
        });

        return response.status(200)
                       .json({Resposta: 'Proposta enviada com sucesso, id: ' + id});

    },

    async List (request,response){
        
        const { id } = request.params;
        const { page=1 } = request.query;

        const count = await connection('06_fPropostas')
                             .count('*');

        const Propostas = await connection('06_fPropostas')
                                .join('03_dGroups AS E1',
                                      'E1.id',
                                      '=',
                                      '06_fPropostas.id_Group')
                                .join('04_dProjects AS E2',
                                      'E2.id',
                                      '=',
                                      '06_fPropostas.id_Projeto')
                                .where('06_fPropostas.id_Projeto', id)
                                .limit(10)
                                .offset((page - 1) * 10)
                                .select('06_fPropostas.*',
                                        'E1.Nome',
                                        'E2.Nome')
                                .timeout(1000);

        if(Propostas == null){
            return response.status(404).json({error:'Não foram encontradas propostas'});
        }

        response.header('X-Total-Count', count['count(*)']);

        return response.json(Propostas);
    },

    async Delete (request, response){

        const { id } = request.params;
        const id_Group = request.headers.authorization;

        const Proposta = await connection('06_fPropostas')
                               .where('id', id)
                               .select('id_Group')
                               .timeout(1000)
                               .first();

        if(Proposta == null){
            return response.status(404).json({error: 'Esse projeto não foi encontrado'})
        }                       

        if(Proposta.id_Group != id_Group){
            return response.status(401).json({error: 'Error de autorização'});
        }

        await connection('06_fPropostas').where('id', id).delete();

        return response.status(200)
                       .json({Resposta: 'Proposta deletada com sucesso!'});
    }
    
}