const connection = require('../database/connection');
const crypto = require('crypto');

module.exports = {
    async Create (request, response){

        const {Nome,
               Descrição,
               Image} = request.body;

        const id_Empresa = request.headers.authorization; 

        const DateTime = new Date();

        const id = crypto.randomBytes(4).toString('HEX');
        
        await connection('04_dProjects').insert({
            id,
            Nome,
            Descrição,
            DateTime,
            Image,
            id_Empresa,
        });

        return response.status(200)
                       .json({reposta: 'Projeto criado com sucesso, id: ' + id});
    },

    async List (request,response){

        const { page = 1 } = request.query;

        const count = await connection('04_dProjects')
                            .count('*');
        
        const Projects = await connection('04_dProjects')
                               .join('02_dEmpresas AS E1',
                                     'E1.id',
                                     '=',
                                     '04_dProjects.id_Empresa')
                                .join('03_dGroups AS E2',
                                     'E2.id',
                                     '=',
                                     '04_dProjects.id_Grupo')
                               .select(['04_dProjects.*',
                                        'E1.Nome_fantasia AS Empresa',
                                        'E2.Nome AS Grupo'])
                               .limit(10)
                               .offset((page - 1)*10)
                               .timeout(1000);

        response.header('X-Total-Count', count['count(*)']);

        return response.json(Projects);

    },

    async Delete (request, response){
        const { id } = request.params;
        const id_Empresa = request.headers.authorization;

        const Projeto = await connection('04_dProjects')
                              .where('id', id)
                              .select('id_Empresa')
                              .timeout(1000)
                              .first();

        if(Projeto == null){
            return response
                   .status(404)
                   .json({error: 'O projeto não foi encontrado'});
        }

        if(Projeto.id_Empresa != id_Empresa){
            return response
                   .status(401)
                   .json({error: 'Erro de autorização'});
        }

        await connection('04_dProjects')
              .where('id', id)
              .delete();

        return response.status(200)
                       .json({Resposta: 'Projeto deletado com sucesso!'});
    },

    async Update (request, response) {

        const {Nome,
            Descrição,
            Image} = request.body;

        const { id } = request.params;
        
        const id_Empresa = request.headers.authorization;

        const Projeto = await connection('04_dProjects')
                              .where('id', id)
                              .select('id_Empresa')
                              .timeout(1000)
                              .first();
        
        if(Projeto == null){
            return response.status(404)
                           .json({error: 'Projeto não encontrado!'});
        }

        if(Projeto.id_Empresa != id_Empresa){
            return response.status(401)
                           .json({error: 'Erro de autorização'});
        }

        await connection('04_dProjects')
              .where('id', id)
              .update({Nome,
                      Descrição,
                      Image,});

        return response.status(200).json({Resposta: 'Projeto atualizado com sucesso!'});
    }
}