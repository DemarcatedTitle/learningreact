exports.up = function(knex, Promise) {
  knex.schema
    .createTable('users', function(table) {
      table.increments();
      table.string('name');
      table.string('password');
      table.timestamps();
    })
    .then(table => table);
  knex.schema
    .createTable('gamehistory', function(table) {
      table.increments();
      table.integer('pid1');
      table.integer('pid2');
      table.string('outcome');
      table.timestamps();
    })
    .then(table => table);
};

exports.down = function(knex, Promise) {};
