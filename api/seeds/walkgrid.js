exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users')
    .del()
    .then(function(table) {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: 1,
          name: 'firstuser',
          password:
            '$2a$10$JutnN6BCKJTO4PFF6hvcOebXLYZXLAB6iKOAqO8mzIrHGVkVmVI3u',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
        {
          id: 2,
          name: 'seconduser',
          password:
            '$2a$10$JutnN6BCKJTO4PFF6hvcOebXLYZXLAB6iKOAqO8mzIrHGVkVmVI3u',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
        {
          id: 3,
          name: 'thirduser',
          password:
            '$2a$10$JutnN6BCKJTO4PFF6hvcOebXLYZXLAB6iKOAqO8mzIrHGVkVmVI3u',
          created_at: knex.fn.now(),
          updated_at: knex.fn.now(),
        },
      ]);
    });
};
