exports.up = function(knex, Promise) {
  knex.schema
    .alterTable('version', function(table) {
      table.timestamps();
    })
    .then(table => table);
};

exports.down = function(knex, Promise) {};
