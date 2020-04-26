
exports.up = function(knex) {
  return knex.schema.createTable('05_dTAGs', function (table){
      //Primary key
      table.string('id').primary();

      table.string('TAG').notNullable;
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('05_dTAGs');
};
