
exports.up = function(knex) {
  return knex.schema.createTable('10_dLocal', function (table){
      //Primary key
      table.string('id').primary();

      table.string('Cidade').notNullable();
      table.string('Estado').notNullable();
      table.string('Pais').notNullable();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('10_dLocal');
};
