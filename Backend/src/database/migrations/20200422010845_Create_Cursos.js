
exports.up = function(knex) {
  return knex.schema.createTable('09_dCursos', function (table){
      //Primary key
      table.string('id').primary();
      table.string('Curso').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('09_dCursos');
};
