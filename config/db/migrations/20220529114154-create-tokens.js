'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      token: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      generated_by: {
        type: Sequelize.NUMBER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATETIME
        defaultValue: new Date(Date.now())
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tokens');
  }
};