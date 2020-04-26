
exports.up = function(knex) {
  return knex.schema.createTable('01_dEstudantes', function (table){
    //Identificação  
    table.string('id').primary();

    
    table.string('Nome').notNullable();
    table.string('Sobrenome').notNullable();
    table.string('senha').notNullable();
    table.string('CPF').notNullable();
    table.string('Periodo').notNullable();
    table.string('Email').notNullable();
    table.string('Telefone').notNullable();

    //Foreing keys
    table.string('id_Universidade').notNullable();
    table.string('id_Curso').notNullable();
    table.string('id_Local').notNullable();
    table.string('id_Group');
})
};

exports.down = function(knex) {
  return knex.schema.dropTable('01_dEstudantes');
};
