const connection = require('../database/connection');

module.exports = {

    async Update (request, response){

        const { id } = request.params;
        const id_Empresa = request.headers.authorization;

        const Proposta = await connection('06_fPropostas')
                               .where('id', id)
                               .select('*')
                               .timeout(1000)
                               .first();

        if(Proposta == null){
            return response.status(404)
                           .json({error: 'Proposta não encontrada.'});
        }    

        const Projeto = await connection('04_dProjects')
                              .where('id', Proposta.id_Projeto)
                              .select('id','id_Empresa')
                              .timeout(1000)
                              .first();

        if(Projeto == null){
            return response.status(404)
                           .json({error: 'Projeto não encontrado.'})
        }

        if(Projeto.id_Empresa != id_Empresa){
            return response.status(401)
                           .json({error: 'Erro de autorização.'});
        }
        
        await connection('04_dProjects')
              .where('id', Projeto.id)
              .update({'id_Grupo': Proposta.id_Group})

        await connection('03_dGroups')
              .where('id', Proposta.id_Group)
              .update({'id_Projeto': Projeto.id});

        return response.status(200).json({Resposta: 'Proposta aceita com sucesso.'})

    }
}