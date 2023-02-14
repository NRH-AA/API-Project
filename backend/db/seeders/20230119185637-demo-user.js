'use strict';

const bcrypt = require("bcryptjs");
const { seedUsers } = require('../../utils/seed.js');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = 'Users';
    
    const users = seedUsers(5);
    users.push({
      email: 'demo@mail.com',
      username: 'Demo',
      hashedPassword: bcrypt.hashSync('password'),
      firstName: 'John',
      lastName: 'Doe'
    });
    
    return queryInterface.bulkInsert(options, users)
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: {[Op.gte]: 0}
    });
  }
};
