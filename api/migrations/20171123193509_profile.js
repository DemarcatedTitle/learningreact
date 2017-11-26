exports.up = function(knex, Promise) {
  knex.schema
    .createTable('profiles', function(table) {
      table.increments();
      table.integer('player_id');
      table.string('bio');
      table.string('location');
      table.string('favorite_game');
      table.timestamps();
    })
    .then(table => table);
  knex.schema
    .createTable('version', function(table) {
      table.increments();
      table.integer('profile_id');
      table.integer('version_number');
    })
    .then(table => table);
};

exports.down = function(knex, Promise) {};
