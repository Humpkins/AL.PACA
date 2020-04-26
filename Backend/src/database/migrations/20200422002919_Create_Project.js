
exports.up = function(knex) {
  return knex.schema.createTable('04_dProjects', function (table){
      //Primary key
      table.string('id').primary();

      table.string('Nome').notNullable();
      table.string('Descrição');
      table.datetime('DateTime').notNullable();
      table.string('Image');

      //Foreign key
      table.string('id_Empresa').notNullable();
      table.string('id_Grupo');

      //Relacionamento
      table.foreign('id_Empresa').references('id').inTable('02_dEmpresas');
      table.foreign('id_Grupo').references('id').inTable('03_dGroups');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('04_dProjects');
};
