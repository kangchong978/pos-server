'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('settings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      company_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      company_logo: {
        type: Sequelize.STRING(255)
      },
      tax: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      address: {
        type: Sequelize.STRING(255)
      },
      email: {
        type: Sequelize.STRING(255)
      },
      website: {
        type: Sequelize.STRING(255)
      },
      phone_number: {
        type: Sequelize.STRING(50)
      },
      receipt_footer_text: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('settings');
  }
};
