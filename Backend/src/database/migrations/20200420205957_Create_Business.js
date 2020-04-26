
exports.up = function(knex) {
  return knex.schema.createTable('02_dEmpresas', function (table){
      //Primary Key
      table.string('id').primary();

      table.string('Nome_fantasia').notNullable();
      table.string('senha').notNullable();
      table.string('Ramo').notNullable();
      table.string('CNPJ').notNullable();
      table.string('Email').notNullable();
      table.string('Telefone').notNullable();
      
      //Foreing keys
      table.string('id_Local').notNullable();
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('02_dEmpresas');
};
