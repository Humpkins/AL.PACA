
exports.up = function(knex) {
  return knex.schema.createTable('06_fPropostas', function (table){
      //Primary Key
      table.string('id').primary();

      table.string('Comentário');
      table.datetime('DateTime').notNullable();
      table.int('Duração');
      table.string('dim_Duração');
      table.float('Orçamento');

      //Foreign key
      table.string('id_Group');
      table.string('id_Projeto');

      //Relacionamentos
      table.foreign('id_Group').references('id').inTable('03_dGroups');
      table.foreign('id_Projeto').references('id').inTable('04_dProjects');
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('06_fPropostas');
};
