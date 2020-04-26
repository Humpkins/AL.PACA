
exports.up = function(knex) {
    return knex.schema.createTable('03_dGroups',function (table){
        //Primary key
        table.string('id').primary();
        
        table.string('Nome');
        table.string('Descrição');
        table.date('Fundação').notNullable();
        table.string('image');

        //Foreign keys
        table.string('id_Fundador').notNullable();
        table.string('id_Diretor');
        table.string('id_Projeto');

        //Relacionamentos
        table.foreign('id_Fundador').references('id').inTable('01_dEstudantes');
        table.foreign('id_Diretor').references('id').inTable('01_dEstudantes');
        table.foreign('id_Projeto').references('id').inTable('04_dProjects');

    })
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('03_dGroups');
  };
  