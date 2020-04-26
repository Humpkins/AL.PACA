const connection = require('../database/connection');

module.exports = {
    
    async Update (request, response){

        const { id } = request.params;

        const id_Diretor = request.headers.authorization;

        const Aplicação = await connection('07_fAplicações')
                          .where('id', id)
                          .select('*')
                          .timeout(1000)
                          .first();
        
        if(Aplicação == null){
            return response.status(404).json({error: 'Aplicação não encontrada'});
        }

        const Group = await connection('03_dGroups')
                      .where('id', Aplicação.id_Group)
                      .select('id_Diretor', 'id')
                      .timeout(1000)
                      .first();
        
        if(Group == null){
            return response.status(404).json({error: 'Grupo não encontrado'});
        }

        if(Group.id_Diretor != id_Diretor){
            return response.status(401).json({error: 'Erro de autorização'});
        }

        await connection('01_dEstudantes')
              .where('id', Aplicação.id_Estudante)
              .update({'id_Group': Group.id});
        
              return response
                     .status(200)
                     .json({sucess: `Estudante ${Aplicação.id_Estudante} recrutado com sucesso`});

    }    
}