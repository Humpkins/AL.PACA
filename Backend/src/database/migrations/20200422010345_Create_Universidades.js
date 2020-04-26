
exports.up = function(knex) {
  return knex.schema.createTable('08_dUniversidades', function (table){
      //Primary key
      table.string('id').primary();

      table.string('Nome_inteiro').notNullable();
      table.string('Iniciais');
      
      //Foreing key
      table.string('id_Local');

  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('08_dUniversidades');
};
