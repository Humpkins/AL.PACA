const connection = require('../database/connection');
const bcrypt = require('bcrypt');

module.exports={
    async Create (request, response){

        const { id,
                senha } = request.body;

        const estudante = await connection('01_dEstudantes')
                                .where('id', id)
                                .select('Nome', 'Sobrenome', 'Email', 'senha')
                                .first();                          

        if(estudante != null){
            
            const compare = await bcrypt.compare(senha, estudante.senha);

            if(!compare){
                return response.status(401).json({error: 'Credenciais do estudante inválidas'})
            }

            return response.status(200).json({Nome: estudante.Nome,
                                              Sobrenome: estudante.Sobrenome,
                                              Email: estudante.Email,
                                              Tipo: 'Estudante'});
        }

        const empresa = await connection('02_dEmpresas')
                              .where('id', id)
                              .select('Nome_fantasia', 'Telefone', 'Email', 'senha')
                              .first();
                            
        if(empresa != null){
            
            compare = await bcrypt.compare(senha, empresa.senha);

            if(!compare){
                return response.status(401).json({error: 'Credenciais da empresa inválidas'})
            }            
            
            return response.status(200).json({Nome_e: empresa.Nome_fantasia,
                                                   Telefone_e: empresa.Telefone,
                                                   Email_e: empresa.Email,
                                                   Tipo: 'Empresa'});
        }

        return response.status(404).json({error: 'Usuário não encontrado!'});
    }
}