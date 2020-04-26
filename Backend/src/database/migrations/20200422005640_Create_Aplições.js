
exports.up = function(knex) {
  return knex.schema.createTable('07_fAplicações', function (table){
      //Primary key
      table.string('id').primary();

      table.string('Comentário');
      table.datetime('DateTime').notNullable();

      //Foreing key
      table.string('id_Estudante').notNullable();
      table.string('id_Group').notNullable();

      //Relacionamentos
      table.foreign('id_Estudante').references('id').inTable('01_dEstudantes');
      table.foreign('id_Group').references('id').inTable('03_dGroups');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('07_fAplicações');
};
