const connection = require('../database/connection');
const crypto = require('crypto');

module.exports ={
    async Create (request, response){
        
        const {Nome,
               Descrição,
               image,
               id_Projeto} = request.body;

        const id_Fundador = request.headers.authorization;
        const id_Diretor  = request.headers.authorization;
        
        const Fundação = new Date();

        const id = crypto.randomBytes(4).toString('HEX');
 
        await connection('03_dGroups').insert({
            id,
            Nome,
            Descrição,
            Fundação,
            id_Fundador,
            id_Diretor,
            id_Projeto,
            image,
        });

        return response.status(200)
                       .json({Resposta: 'Grupo criado com sucesso, id: ' + id});
        
    },

    async List (request, response){
        
        const { page = 1 } = request.query;
        
        const count = await connection('03_dGroups')
                            .count('*');

        const groups = await connection('03_dGroups')
                             .join('01_dEstudantes AS E1',
                                   'E1.id',
                                   '=',
                                   '03_dGroups.id_Fundador')
                             .join('01_dEstudantes AS E2',
                                   'E2.id',
                                   '=',
                                   '03_dGroups.id_Diretor')
                             .select(['03_dGroups.*',
                                     'E1.Nome AS Fundador',
                                     'E2.Nome AS Diretor',])
                             .limit(10)
                             .offset((page - 1)*10)
                             .timeout(1000);

        if(groups == null){
            return response.status(404)
                           .json({error: 'Não foram encontrados grupos'});
        }

        response.header('X-Total-Count', count['count(*)']);

        return response.json(groups);
    },

    async Delete (request, response){
        const { id } = request.params;
        const id_Estudante = request.headers.authorization;

        const Group = await connection('03_dGroups')
                            .where('id', id)
                            .select('id_Diretor')
                            .timeout(1000)
                            .first();

        if(Group == null){
            return response.status(404)
                           .json({error: 'O grupo não foi encontrado'});
        }                            

        if(Group.id_Diretor != id_Estudante){
            return response.status(401)
                           .json({error: 'Erro de autorização!'});
        };

        const Grupo = await connection('03_dGroups')
                            .where('id', id)
                            .delete();


        return response.status(200)
                       .json({Resposta: 'Grupo deletado com sucesso!'});

    },

    async Update (request, response){
        
        const {Nome,
            Descrição,
            Fundação,
            image,
            id_Projeto} = request.body;

        const { id } = request.params;

        const id_Diretor = request.headers.authorization;

        const Group = await connection('03_dGroups')
                            .where('id', id)
                            .select('id_Diretor')
                            .timeout(1000)
                            .first();

        if(Group == null){
            return response.status(404)
                           .json({error: 'Grupo não encontrado!'});
        };

        if(Group.id_Diretor != id_Diretor){
            return response.status(401)
                           .json({error: 'Erro de autorização!'});
        };

        await connection('03_dGroups')
              .where('id', id)
              .update({ Nome,
                        Descrição,
                        id_Diretor,
                        image,
                      });

        return response.status(200)
                       .json({resposta: 'Grupo atualizado com sucesso!'});
    }
}